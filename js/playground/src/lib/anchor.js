let wsAPI = null;
let keyRing=null;
let unlistening = null;

const limits={
    key:40,					//Max length of anchor name ( ASCII character )
    protocol:256,			//Max length of protocol	
    raw:4*1024*1024,		//Max length of raw data
	address:48,				//SS58 address length
};

const self = {
	/************************/
	/***Params and setting***/
	/************************/

	limited:(key,raw,protocol,address)=>{
        if(key!==undefined) return key.length>limits.key?true:false;
        if(protocol!==undefined) return protocol.length>limits.protocol?true:false;
        if(raw!==undefined) return raw.length>limits.raw?true:false;
		if(address!==undefined) return address.length!==limits.address?true:false;
        return false;
    },
	setWebsocket: (ws) => {
		wsAPI = ws;
	},
	setKeyring:(ks)=>{
		keyRing=new ks({ type: 'sr25519' });;
	},

	/************************/
	/***Polkadot functions***/
	/************************/
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
	clean: () => {
		if (unlistening != null) {
			unlistening();
			unlistening = null;
		}
		return true;
	},
	balance: (account, ck) => {
		if(wsAPI===null) return ck && ck({error:"No websocke link."});
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

	/************************/
	/***Anchor data browse***/
	/************************/
	owner:(anchor,ck)=>{
		let unsub = null;
		wsAPI.query.anchor.anchorOwner(anchor, (res) => {
			unsub();
			if(res.isEmpty) return ck && ck(false);
			const owner=res.value[0].toHuman();
			return ck && ck(owner);
		}).then((fun)=>{
			unsub = fun;
		});
	},
	latest: (anchor, ck) => {
		if(wsAPI===null) return ck && ck({error:"No websocke link."});
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
		if(wsAPI===null) return ck && ck({error:"No websocke link."});
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
						details.target=dt.value[2].toHuman();		//selling target 
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
		if(wsAPI===null) return ck && ck({error:"No websocke link."});
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
	//TODO: [[anchor,block],[anchor,block],...,[anchor,block]], the anchor target list
	footprint:(anchor,ck)=>{

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
		return arr;
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

	/**************************/
	/***Anchor data to chain***/
	/**************************/

	write: (pair, anchor, raw, protocol, ck) => {
		if(wsAPI===null) return ck && ck({error:"No websocke link."});
		if (typeof protocol !== 'string') protocol = JSON.stringify(protocol);
		if (typeof raw !== 'string') raw = JSON.stringify(raw);
		if(self.limited(anchor,raw,protocol)) return ck && ck({error:"Params error"});

		let unsub = null;
		wsAPI.query.anchor.anchorOwner(anchor, (res) => {
			unsub();	//close anchorOwner subcribition
			if(!res.isEmpty){
				const owner=res.value[0].toHuman();
				if(owner!==pair.address) return ck && ck({error:`Not the owner of ${anchor}`});
			}
			const pre = res.isEmpty?0:res.value[1].words[0];
			try {
				wsAPI.tx.anchor.setAnchor(anchor, raw, protocol, pre).signAndSend(pair, (res) => {
					return ck && ck(res);
				});
			} catch (error) {
				return ck && ck({error:error});
			}
		}).then((fun)=>{
			unsub = fun;
		});
	},
	check:(anchor,address,ck)=>{

	},
	load:(encryJSON,password,ck)=>{
		if(!password) return false;
		const pair = keyRing.createFromJson(encryJSON);
		try {
			pair.decodePkcs8(password);
			return ck && ck(pair);
		} catch (error) {
			return ck && ck(false);
		}
	},
	/************************/
	/***Anchor market funs***/
	/************************/
	
	// TODO: need to page and step
	market: (ck) => {
		if(wsAPI===null) return ck && ck({error:"No websocke link."});
		//console.log(wsAPI.query.anchor.sellList);
		wsAPI.query.anchor.sellList.entries().then((arr) => {
			let list=[];
			if(!arr) return ck && ck(list);
			for(let i=0;i<arr.length;i++){
				const row=arr[i];
				const key=row[0].toHuman();
				const info=row[1].toHuman();
				list.push({
					name:key[0],
					owner:info[0],
					price:info[1],
					target:info[2],
					free:info[0]===info[2],
				});
			}
			return ck && ck(list);
		});
	},

	// list: ( ck) => {
	// 	if(wsAPI===null) return ck && ck({error:"No websocke link."});
	// 	wsAPI.query.anchor.anchorOwner.entries().then((arr) => {
	// 		return ck && ck(arr);
	// 	});
	// },
	// view: (anchor,block,owner,ck)=>{
	// 	if(wsAPI===null) return ck && ck({error:"No websocke link."});
	// 	self.target(anchor,block,ck,owner);
	// },

	
	
	sell: (pair, anchor, price, ck , target) => {
		if(wsAPI===null) return ck && ck({error:"No websocke link."});
		anchor = anchor.toLocaleLowerCase();
		if(self.limited(anchor)) return ck && ck(false);

		let unsub = null;
		wsAPI.query.anchor.anchorOwner(anchor, (res) => {
			unsub();
			if(res.isEmpty) return ck && ck({error:"No target anchor."});

			const owner=res.value[0].toHuman();
			if(owner!==pair.address) return ck && ck({error:`Not the owner of ${anchor}`});
			wsAPI.tx.anchor.sellAnchor(anchor,price,!target?owner:target).signAndSend(pair, (res) => {
				return ck && ck(res);
			});
		}).then((fun)=>{
			unsub = fun;
		});
	},
	unsell:(pair, anchor, ck) => {
		if(wsAPI===null) return ck && ck({error:"No websocke link."});
		anchor = anchor.toLocaleLowerCase();
		if(self.limited(anchor)) return ck && ck(false);
		if (wsAPI === null) return ck && ck(false);
		wsAPI.tx.anchor.unsellAnchor(anchor).signAndSend(pair, (res) => {
			return ck && ck(res);
		});
	},
	buy: (pair, anchor, ck) => {
		if(wsAPI===null) return ck && ck({error:"No websocke link."});
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
	
	
	/************************/
	/***Anchor data format***/
	/************************/
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
		
		//remove the thound seperetor
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

exports.anchorJS={
	set:self.setWebsocket,		//cache the linker promise object
	setKeyring:self.setKeyring,	//set Keyring to get pair
	subcribe:self.listening,	//subcribe the latest block which including anchor data
	load:self.load,						
	search:self.latest,
	balance:self.balance,

	latest:self.latest,
	target:self.target,
	history:self.history,
	multi:self.multi,
	footprint:self.footprint,
	owner:self.owner,

	write:self.write,

	market:self.market,
	sell:self.sell,
	unsell:self.unsell,
	buy:self.buy,
};