//simple persist storage library.

const map={};
const cache={};

const STORAGE={
	dump:()=>{
		return map;
	},
	//cache storage
	setCache:(key,val)=>{
		cache[key]=val;
		return true;
	},
	getCache:(key)=>{
		return cache[key];
	},

	//persist storage
	setMap:(obj) => {
		for(var k in obj) map[k]=obj[k];
		return true;
	},
	removePersist:(name) => {
		if(!map[name]) return false;
		localStorage.removeItem(map[name]);
		return true;
	},
	setPersist:(name,obj) => {
		console.log(name);
		console.log(obj);
		console.log(map);
		
		if(!map[name]) return false;
		localStorage.setItem(map[name],JSON.stringify(obj));
		return true;
	},
	getPersist:(name) => {
		if(!map[name]) return false;
		const data=localStorage.getItem(map[name]);
		try {
			const json=JSON.parse(data);
			return json;
		} catch (error) {
			return data;
		}
	},
};

export default STORAGE;