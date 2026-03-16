const memoList=document.getElementById("memo-list");
const addBtn=document.getElementById("addMemo");

let memos=JSON.parse(localStorage.getItem("family_memos"))||[];

function renderMemos(){

memoList.innerHTML="";

memos.forEach((m,i)=>{

const div=document.createElement("div");

div.className="memo "+m.color;

div.innerText=m.text;

div.onclick=()=>{

if(confirm("削除しますか？")){
memos.splice(i,1);
saveMemos();
}

};

memoList.appendChild(div);

});

}

function saveMemos(){

localStorage.setItem("family_memos",JSON.stringify(memos));

renderMemos();

}

addBtn.onclick=()=>{

const text=prompt("メモを書く");

if(!text)return;

const colors=["yellow","green","blue","pink"];

const memo={
text:text,
color:colors[Math.floor(Math.random()*colors.length)]
};

memos.push(memo);

saveMemos();

};

renderMemos();
