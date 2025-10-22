const form = document.getElementById('subcatagoryForm');
const message = document.getElementById('message');


/* ---------- parse URL params for ID & act ---------- */
const urlParams = new URLSearchParams(window.location.search);
const ID = urlParams.get('subcatID');
const actParam = urlParams.get('act'); // undefined | "1" (update) | "2" (delete)
console.log('ID :' + ID + ' Action :'+actParam);
let currentAct = ""; // "" create, "1" update, "2" delete

async function loadForm(id, act) {
//console.log("Loading catagory", id, act);

 // if (!id) return;

  try {
    const res = await fetch(`/api/subcatagory/${id}`);
    if (!res.ok) {
      setMessage('Sub-Catagory not found', true);
      return;
    }
    const data = await res.json();
    document.getElementById('subcatID').value = id;
	 document.getElementById('act').value = act;
    document.getElementById('subcatNm').value = data.subcatNm || '';
    
     const res1 = await fetch('/api/catagory');
    if (!res1.ok) {
      setMessage('Catagory not found', true);
      return;
    }
    const data1 = await res1.json();

    let catId= document.getElementById('catID');
    var opt='<option value="0">-- Select Catagory --</option>';
    data1.forEach(row => {
   
		var selected="";
    selected= row.catID==data.catID ? "selected" : "";
		opt= opt + '<option value="'+row.catID+'" '+selected+'>'+row.catName+'</option>';
		
  });
    catId.innerHTML=opt;


    document.getElementById('subcatRate').value = data.subcatRate || '';
    document.getElementById('Locality').value = data.Locality || '';
  
	
   

    if (act === '1') {
      currentAct = '1';
     
      document.getElementById('submitBtn').textContent = '✔ Update';
     document.getElementById('submitBtn').value='✔ Update';
      setMessage('Record Ready for Update.');
	  
    } else if (act === '2') {
      currentAct = '2';
      
	  document.getElementById('submitBtn').textContent = '✔ Delete';
     document.getElementById('submitBtn').value='✔ Delete';
      setMessage('Record Ready for Delete.');
	  
    } else {
       document.getElementById('submitBtn').textContent = '✔  Submit';
      document.getElementById('submitBtn').value='✔  Submit';
      setMessage('Ready for New Record Entry..'); 
      document.getElementById('catID').style.border =  document.getElementById('Locality').style.border;
    }

  } catch (err) {
    console.error(err);
    setMessage('Error loading Suppliers', true);
  }
}

function validateForm() {
  let ok = true;
  const name = document.getElementById('subcatNm').value.trim();
  if (!name) {
   document.getElementById('subcatNm').style.border = "2px red solid";
    ok = false;
  }
   //const catId= document.getElementById('catID');
   var options = document.getElementById("catID").options;
   	if( options[0].selected == true)
    {
        document.getElementById('catID').style.border = "2px red solid";
        ok = false;
    }
  return ok;
}


form.addEventListener('submit', async (e) => {
  e.preventDefault();
   if (!validateForm()) return;
  const subcat = {
    subcatNm: document.getElementById('subcatNm').value,
    catID: document.getElementById('catID').value,
    subcatRate: document.getElementById('subcatRate').value,
    Locality: document.getElementById('Locality').value,
  
  };

  const id = document.getElementById('subcatID').value;
  const actVal = document.getElementById('act').value;

    //console.log(JSON.stringify(Cust));
  let res;
 try {
	  if(actVal=='1')
	  {
		if (!id) { setMessage('No record selected for Update.', true); return; }
		if (!confirm('Are you sure want to Update Record?')) return;
		// update
		res = await fetch(`/api/subcatagory/${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(subcat)
		});
		 alert("Record Updated Successfully.");
		 setBlank();
	  }
	  else if(actVal=='2')
	  {
		if (!id) { setMessage('No record selected for Delete.', true); return; }
		if (!confirm('Are you sure want to Delete Record?')) return;
		  // delete
		res = await fetch(`/api/subcatagory/${id}`, {
		method: 'DELETE',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify()
		});
		 alert("Record Deleted Successfully.");  
		 setBlank();
	  }  
	else
	{
		if (!confirm('Are you sure want to Add Record?')) return;
		// insert
		res = await fetch('/api/subcatagory', {
		  method: 'POST',
		  headers: { 'Content-Type': 'application/json' },
		  body: JSON.stringify(subcat)
		});
		 alert("Record Saved Successfully.");
		 setBlank();
	}

  const result = await res.json();
  //message.textContent = result.message;
  //form.reset();
  id="";
  actVal="";
 
  setBlank();
 
  } catch (err) {
    //setMessage('Server error', true);
	return;
  }
  
  

});


function setBlank()
{
    loadForm("", "");
  /*
    document.getElementById('act').value="";
    document.getElementById('subcatID').value = "";
    document.getElementById('subcatNm').value ="";
    document.getElementById('quality').value = "";
    document.getElementById('remark').value = "";
    document.getElementById('submitBtn').textContent = '✔  Submit';
    document.getElementById('submitBtn').value='✔  Submit';
    document.getElementById('message').textContent = "Ready for New Record Entry..";  */
}
// Initial load
//document.addEventListener('DOMContentLoaded', loadSuppliers);
function setMessage(text, isError=false) {
  const m = document.getElementById('message');
  m.textContent = text;
  if (isError) m.style.background = '#f8d7da', m.style.color = '#721c24', m.style.borderColor = '#f5c6cb';
  else m.style.background = '#dcddec', m.style.color = '#155724', m.style.borderColor = '#c3e6cb';
}


function codeAddress() {
		
	if (ID) {
		loadForm(ID, actParam);
	  }
    else{
      loadForm("", "");
    }
}
window.onload = codeAddress;
