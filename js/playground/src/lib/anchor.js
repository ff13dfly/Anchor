let wsAPI = null;
let unlistening = null;

const limits={
    key:40,					//Max length of anchor name ( ASCII character )
    protocol:256,			//Max length of protocol	
    raw:4*1024*1024,		//Max length of raw data
	account:48,				//SS58 address length
};

const self = {
	limited:(key,proto,raw,account)=>{
        if(key!==undefined) return key.length>limits.key?true:false;
        if(proto!==undefined) return proto.length>limits.protocol?true:false;
        if(raw!==undefined) return raw.length>limits.raw?true:false;
		if(account!==undefined) return account.length!==limits.account?true:false;
        return false;
    },
	setWebsocket: (ws) => {
		wsAPI = ws;
	},
	unlistening:(ck)=>{
		if(unlistening!==null) unlistening();
		return ck && ck();
	},
	listening: (ck) => {
		if (wsAPI === null) return ck && ck(false);
		self.clean();
		wsAPI.rpc.chain.subscribeFinalizedHeads((lastHeader) => {
			//console.log(lastHeader);
			const hash = lastHeader.hash.toHex();
			const block=lastHeader.number.toHuman();
			const list=[];
			const format=self.format;
			self.specific(hash,(exs)=>{
				for(let i=0;i<exs.length;i++){
					var ex=exs[i],row=ex.args;
					if(row.key.substr(0, 2).toLowerCase() === '0x') row.key=self.decodeUTF8(row.key);
					row.signer=ex.owner;
					row.block=block;

					var dt=format(row.key,self.decor(row));
					dt.empty=false;
					list.push(dt);
				}
				return ck && ck(list);
			});
		}).then((fun) => {
			unlistening = fun;
		});
		return self.unlistening;		//返回撤销listening的方法
	},
	latest: (anchor, ck) => {
		anchor = anchor.toLocaleLowerCase();
		if(self.limited(anchor)) return ck && ck(false);
		let unsub=null;
		wsAPI.query.anchor.anchorOwner(anchor, (res) =>{
			unsub();
			if (res.isEmpty){
				return ck && ck(false);
			}
			const block = res.value[1].words[0];
			self.target(anchor,block,ck);
		}).then((fun) => {
			unsub = fun;
		});
	},
	target:(anchor,block,ck)=>{
		anchor = anchor.toLocaleLowerCase();
		if (anchor.substr(0, 2) === '0x') anchor = self.decodeUTF8(anchor);

		if(self.limited(anchor)) return ck && ck(false);

		let unsub=null;
		wsAPI.query.anchor.anchorOwner(anchor, (res) =>{
			unsub();
			const details={block:block};
			if (res.isEmpty) return ck && ck(self.format(anchor,details));
			details.owner=res.value[0].toHuman();
			wsAPI.rpc.chain.getBlockHash(block, (res) => {
				const hash = res.toHex();
				if (!hash) return ck && ck(self.format(anchor,details));

				self.specific(hash,(dt)=>{
					if(dt===false) return ck && ck(self.format(anchor,details));
					
					details.empty = false;
					for(var k in dt) details[k]=dt[k];

					var unlist=null;
					wsAPI.query.anchor.sellList(anchor, (dt) => {
						unlist();
						if (dt.value.isEmpty){
							return ck && ck(self.format(anchor,details));
						} 
						details.sell = true;
						details.cost = dt.value[1].words[0];		//selling cost
						details.target=dt.value[2].words[0];		//selling target 
						return ck && ck(self.format(anchor,details));
					}).then((fun) => {
						unlist = fun;
					});

				},anchor);
			});
		}).then((fun)=>{
			unsub=fun;
		});
	},
	history: (anchor, ck, limit) => {
		anchor = anchor.toLocaleLowerCase();
		if(self.limited(anchor)) return ck && ck(false);

		let unsub = null;
		wsAPI.query.anchor.anchorOwner(anchor, (res) => {
			unsub();
			if (res.isEmpty) return ck && ck(false);
			const block = res.value[1].words[0];
			self.loop(anchor, block, limit, (list)=>{
				if(list.length===0) return ck && ck(list);
				const res=[],format=self.format;
				for(let i=0;i<list.length;i++){
					var row=list[i];
					res.push(format(row.key,row));
				}
				return ck && ck(res);
			});
		}).then((fun)=>{
			unsub = fun;
		});
	},
	loop: (anchor, block, limit, ck, list) => {
		//console.log(`开始获取${anchor}的历史，最新块的是${block},遍历到${limit}`);
		limit = !limit ? 0 : limit;
		if (!list) list = [];
		wsAPI.rpc.chain.getBlockHash(block, (res)=>{
			const hash = res.toHex();
			self.specific(hash,(dt)=>{
				dt.block=block;
				list.push(dt);
				if (dt.pre === limit || parseInt(dt.pre) === 0) return ck && ck(list);
				else return self.loop(anchor, dt.pre, limit, ck, list);
			},anchor);
		});
	},

	multi: (list,ck,done,map)=>{
		if(!done) done=[];
		if(!map) map={};

		const row=list.pop();
		done.push(row);
		if (typeof (row) == 'string') {
			self.latest(row,(data)=>{
				map[row]=data;
				if(list.length===0) return ck && ck(self.groupMulti(done,map));
				return self.multi(list,ck,done,map);
			});
		} else {
			self.target(row[0],row[1],(data)=>{
				map[row[0]+'_'+row[1]]=data;
				if(list.length===0) return ck && ck(self.groupMulti(done,map));
				return self.multi(list,ck,done,map);
			});
		}
	},
	groupMulti:(list,map)=>{
		const arr=[];
		const format=self.format;
		for (let i = 0; i < list.length; i++) {
			const row = list[i];
			const data=map[(typeof (row) == 'string')?row:(row[0]+'_'+row[1])];
			arr.push(!data?format(list[i]):data);
		}
		//console.log(arr);
		return arr;
	},
	
	market: (ck) => {
		if (wsAPI === null) return ck && ck(false);
		wsAPI.query.anchor.sellList.entries().then((arr) => {
			return ck && ck(arr);
		});
	},
	list: ( ck) => {
		if (wsAPI === null) return ck && ck(false);
		wsAPI.query.anchor.anchorOwner.entries().then((arr) => {
			return ck && ck(arr);
		});
	},
	view: (anchor,block,owner,ck)=>{
		self.target(anchor,block,ck,owner);
	},

	write: (pair, anchor, raw, protocol, ck) => {

		if (wsAPI === null) return ck && ck(false);
		if (typeof protocol !== 'string') protocol = JSON.stringify(protocol);
		if (typeof raw !== 'string') raw = JSON.stringify(raw);

		if(self.limited(anchor,protocol,raw)) return ck && ck(false);

		let unsub = null;
		wsAPI.query.anchor.anchorOwner(anchor, (res) => {
			unsub();	//关闭anchorOwner的订阅
			const pre = res.isEmpty?0:res.value[1].words[0];
			//console.log(wsAPI.tx.anchor.setAnchor(anchor, raw, protocol, pre));
			// console.log(wsAPI.tx.anchor.setAnchor(anchor, raw, protocol, pre).paymentInfo);
			// wsAPI.tx.anchor.setAnchor(anchor, raw, protocol, pre).paymentInfo(pair,(res)=>{
			// 	console.log(res);
			// });
			// wsAPI.tx.anchor.setAnchor(anchor, raw, protocol, pre).signAndSend(pair, (res) => {
			// 	return ck && ck(res);
			// }).then().catch((err)=>{
			// 	console.log(err);
			// });

			//下面注释掉的代码，没有办法捕捉错误的
			// try {
			// 	wsAPI.tx.anchor.setAnchor(anchor, raw, protocol, pre).signAndSend(pair, (res) => {
			// 		console.log(res);
			// 		return ck && ck(res);
			// 	});
			// } catch (error) {
			// 	return ck && ck({error:'Failed to write.'});
			// }

			//部署的会报错的代码
			//TODO:重要！看了Polkadot自己的代码，可能本来就有问题在signAndSend上，捕获不到错误。可以考虑升级版本来处理。
			return wsAPI.tx.anchor.setAnchor(anchor, raw, protocol, pre).signAndSend(pair, (res) => {
				return ck && ck(res);
			});
		}).then((fun)=>{
			unsub = fun;
		});
	},
	
	sell: (pair, anchor, cost, ck) => {
		anchor = anchor.toLocaleLowerCase();
		if(self.limited(anchor)) return ck && ck(false);
		if (wsAPI === null) return ck && ck(false);
		wsAPI.tx.anchor.sellAnchor(anchor, cost).signAndSend(pair, (res) => {
			return ck && ck(res);
		});
	},
	unsell:(pair, anchor, ck) => {
		anchor = anchor.toLocaleLowerCase();
		if(self.limited(anchor)) return ck && ck(false);
		if (wsAPI === null) return ck && ck(false);
		wsAPI.tx.anchor.unsellAnchor(anchor).signAndSend(pair, (res) => {
			return ck && ck(res);
		});
	},
	buy: (pair, anchor, ck) => {
		anchor = anchor.toLocaleLowerCase();
		if(self.limited(anchor)) return ck && ck(false);
		if (wsAPI === null) return ck && ck(false);
		try {
			wsAPI.tx.anchor.buyAnchor(anchor).signAndSend(pair, (result) => {
				return ck && ck(result);
			});
		} catch (error) {
			return ck && ck(error);
		}
	},
	
	balance: (account, ck) => {
		if(self.limited(undefined,undefined,undefined,account)) return ck && ck(false);
		if (wsAPI === null) return ck && ck(false);
		let unsub=null;
		wsAPI.query.system.account(account, (res) => {
			if(unsub!=null) unsub();
			return ck && ck(res);
		}).then((fun)=>{
			unsub=fun;
		});
	},
	clean: () => {
		if (unlistening != null) {
			unlistening();
			unlistening = null;
		}
		return true;
	},
	specific:(hash,ck,anchor)=>{
		if(self.limited(anchor)) return ck && ck(false);
		wsAPI.rpc.chain.getBlock(hash).then((dt) => {
			if (dt.block.extrinsics.length === 1) return ck && ck(false);

			wsAPI.query.system.events.at(hash,(evs)=>{

				const exs = self.filter(dt, 'setAnchor',self.status(evs));
				if(exs.length===0) return ck && ck(false);
				if(anchor===undefined) return ck && ck(exs);
				
				//单一的block里只有一个anchor，才可以这么处理
				var data=null;
				for(let i=0;i<exs.length;i++){
					var ex=exs[i],row=ex.args;
					if(row.key.substr(0, 2).toLowerCase() === '0x') row.key=self.decodeUTF8(row.key);
					if(row.key.toLowerCase()===anchor){
						data=row;
						data.signer=ex.owner;
						data.stamp=parseInt(ex.stamp);
					}
				}
				if(data===null) return ck && ck(false);
				return ck && ck(self.decor(data));
			});
		});
	},

	decor:(data)=>{
		if(data.key.substr(0, 2).toLowerCase() === '0x') data.key=self.decodeUTF8(data.key);
		if(data.raw.substr(0, 2).toLowerCase() === '0x') data.raw = self.decodeUTF8(data.raw);
		if(data.protocol){
			try {
				var proto=JSON.parse(data.protocol);
				data.protocol=proto;
				if (proto.type === "data" && proto.format === "JSON") data.raw = JSON.parse(data.raw);
			} catch (error) {
				console.log(error);
			}
		}
		data.pre=parseInt(data.pre.replace(/,/gi, ''));
		
		//扩展部分的数据处理
		if(data.block) data.block=parseInt(data.block.replace(/,/gi, ''));
		return data;
	},
	filter: (exs, method,status) => {
		let arr = [];
		//console.log(exs[0].toHuman());
		let stamp=0;
		exs.block.extrinsics.forEach((ex, index) => {
			if(index===0){
				stamp=ex.toHuman().method.args.now.replace(/,/gi, '');
			}
			if(index===0 || status[index]!=="ExtrinsicSuccess") return false;
			const dt = ex.toHuman();
			//console.log(dt);
			if (dt.method.method === method) {
				const res = dt.method;
				res.owner = dt.signer.Id;
				res.stamp = stamp;
				arr.push(res);
			}
		});
		return arr;
	},
	status:(list)=>{
		const evs=list.toHuman();
		const map={};
		for(var i=0;i<evs.length;i++){
			const ev=evs[i],index=ev.phase.ApplyExtrinsic;
			if(ev.event.section!=="system") continue;
			map[index]=ev.event.method;
		}
		return map;
	},
	decodeUTF8:(str) => {
		return decodeURIComponent(str.slice(2).replace(/\s+/g, '').replace(/[0-9a-f]{2}/g, '%$&'));
	},
	format:(anchor,obj,emtpy)=>{
		return {
			"name":!anchor?"":anchor,
			"protocol":(obj && obj.protocol)?obj.protocol:null,
			"raw":(obj && obj.raw)?obj.raw:null,
			"block":(obj && obj.block)?obj.block:0,
			"stamp":(obj && obj.stamp)?obj.stamp:0,
			"pre":(obj && obj.pre)?obj.pre:0,
			"signer":(obj && obj.signer)?obj.signer:"",
			"empty":(obj && obj.empty===false)?obj.empty:true,
			"owner":(obj && obj.owner)?obj.owner:"",
			"sell":(obj && obj.sell)?obj.sell:false,
			"cost":(obj && obj.cost)?obj.cost:0,
			"target":(obj && obj.target)?obj.target:null,
		};
	},
};

const Direct = {
	set: {
		websocket: self.setWebsocket,
	},
	common: {
		balance: self.balance,
		search: self.latest,
		multi: self.multi,
		target:self.target,
		history: self.history,
		write: self.write,
		sell: self.sell,
		unsell:self.unsell,
		buy: self.buy,
		market: self.market,
		list:self.list,
		subscribe: self.listening,
		clean: self.clean,
	},
};

export default Direct;