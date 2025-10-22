const form = document.getElementById('catagoryForm');
const message = document.getElementById('message');
//const list = document.getElementById('supplierList');

/* ---------- parse URL params for ID & act ---------- */
const urlParams = new URLSearchParams(window.location.search);
const ID = urlParams.get('catID');
const actParam = urlParams.get('act'); // undefined | "1" (update) | "2" (delete)
console.log('ID :' + ID + ' Action :'+actParam);
let currentAct = ""; // "" create, "1" update, "2" delete

async function loadForm(id, act) {
//console.log("Loading catagory", id, act);
  if (!id) return;
  try {
    const res = await fetch(`/api/catagory/${id}`);
    if (!res.ok) {
      setMessage('Catagory not found', true);
      return;
    }
    const data = await res.json();
    document.getElementById('catID').value = id;
	 document.getElementById('act').value = act;
    document.getElementById('catName').value = data.catName || '';
    document.getElementById('quality').value = data.quality || '';
    document.getElementById('remark').value = data.remarks || '';
  
	
   

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
      setMessage('Ready for New Record Entry..');
    }

  } catch (err) {
    console.error(err);
    setMessage('Error loading Suppliers', true);
  }
}

function validateForm() {
  let ok = true;
  const name = document.getElementById('catName').value.trim();
  if (!name) {
   document.getElementById('catName').style.border = "2px red solid";
    ok = false;
  }
  return ok;
}


form.addEventListener('submit', async (e) => {
  e.preventDefault();
   if (!validateForm()) return;
  const cat = {
     
    catName: document.getElementById('catName').value,
    quality: document.getElementById('quality').value,
    remarks: document.getElementById('remark').value,
   
  };

  const id = document.getElementById('catID').value;
  const actVal = document.getElementById('act').value;

    //console.log(JSON.stringify(Cust));
  let res;
 try {
	  if(actVal=='1')
	  {
		if (!id) { setMessage('No record selected for Update.', true); return; }
		if (!confirm('Are you sure want to Update Record?')) return;
		// update
		res = await fetch(`/api/catagory/${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(cat)
		});
		 alert("Record Updated Successfully.");
		 setBlank();
	  }
	  else if(actVal=='2')
	  {
		if (!id) { setMessage('No record selected for Delete.', true); return; }
		if (!confirm('Are you sure want to Delete Record?')) return;
		  // delete
		res = await fetch(`/api/catagory/${id}`, {
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
		res = await fetch('/api/catagory', {
		  method: 'POST',
		  headers: { 'Content-Type': 'application/json' },
		  body: JSON.stringify(cat)
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
	
    document.getElementById('act').value="";
    document.getElementById('catID').value = "";
    document.getElementById('catName').value ="";
    document.getElementById('quality').value = "";
    document.getElementById('remark').value = "";
    document.getElementById('submitBtn').textContent = '✔  Submit';
    document.getElementById('submitBtn').value='✔  Submit';
    document.getElementById('message').textContent = "Ready for New Record Entry.."; 
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
}
window.onload = codeAddress;
