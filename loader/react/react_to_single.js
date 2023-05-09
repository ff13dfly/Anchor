//!important, Package index.html and loader.min.js together
//!important, Node.js needed.

const fs=require('fs');
const file={
    read:(target,ck,toJSON)=>{
        fs.stat(target,(err,stats)=>{
            if (err) return ck && ck({error:err});
            if(!stats.isFile()) return ck && ck(false);
            fs.readFile(target,(err,data)=>{
                if (err) return ck && ck({error:err});
                const str=data.toString();
                if(!toJSON) return ck && ck(str);
                try {
                    const json=JSON.parse(str);
                    return ck && ck(json);
                } catch (error) {
                    return ck && ck({error:'Invalid JSON file.'});
                }
            });
        });
    },
    save:(name,data,ck)=>{
        const target=`./${name}`;
        fs.writeFile(target, data,'utf8',function (err) {
            if (err) return ck && ck({error:err});
            return ck && ck();
        });
        
    },

    libs:(list,ck,txt)=>{
        if(list.length===0) return ck && ck(txt);
        if(!txt) txt=";";
        const row=list.pop();
        file.read(row,(js)=>{
            txt+=js;
            return file.libs(list,ck,txt);
        });
    },
};

const source='index.html';
const target='loader.html';
const source_js='loader.min.js';
const replace_js='<script src="loader.min.js"></script>';

const ls={
    "Polkadot":"lib/polkadot.min.js",
    "anchorJS":"lib/anchor.min.js",
    "easy":"lib/easy.min.js",
}

file.read(source,(txt)=>{
    txt=txt.replace(replace_js,"");
    txt=txt.replace('</html>',"");
    for(var k in ls){
        var row=`<script src="${ls[k]}"></script>`;
        txt=txt.replace(row,"");
    }
    
    const list=[];
    for(var k in ls)list.push(ls[k]);

    file.libs(list,(code)=>{
        file.read(source_js,(js)=>{
            const result=`${txt}<script>${code}${js}</script></html>`;
            file.save(target,result,()=>{
                console.log('Done!');
            });
        });
    });
    
});