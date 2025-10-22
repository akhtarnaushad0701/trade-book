const form = document.getElementById('customerForm');
const message = document.getElementById('message');
//const list = document.getElementById('supplierList');

/* ---------- parse URL params for ID & act ---------- */
const urlParams = new URLSearchParams(window.location.search);
const ID = urlParams.get('CustID');
const actParam = urlParams.get('act'); // undefined | "1" (update) | "2" (delete)
console.log('ID :' + ID + ' Action :'+actParam);
let currentAct = ""; // "" create, "1" update, "2" delete
/*
async function loadSuppliers() {
  const res = await fetch('/api/suppliers');
  const data = await res.json();
  list.innerHTML = '';
  data.forEach(sup => {
    const li = document.createElement('li');
    li.textContent = `${sup.supName} - ${sup.supContact}`;
    list.appendChild(li);
  });
}
*/
async function loadSuppliers(id, act) {
console.log("Loading customer", id, act);
  if (!id) return;
  try {
    const res = await fetch(`/api/customers/${id}`);
    if (!res.ok) {
      setMessage('Customer not found', true);
      return;
    }
    const data = await res.json();
    document.getElementById('CustID').value = id;
	 document.getElementById('act').value = act;
    document.getElementById('CustName').value = data.CustName || '';
    document.getElementById('Contact').value = data.Contact || '';
    document.getElementById('address').value = data.Address || '';
    document.getElementById('prevdue').value =data.PrevDue || '';
	document.getElementById('remark').value =data.Remark || '';
   

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
  const name = document.getElementById('CustName').value.trim();
  if (!name) {
   document.getElementById('CustName').style.border = "2px red solid";
    ok = false;
  }
  return ok;
}


form.addEventListener('submit', async (e) => {
  e.preventDefault();
   if (!validateForm()) return;
  const Cust = {
     
    CustName: document.getElementById('CustName').value,
    Contact: document.getElementById('Contact').value,
    Address: document.getElementById('address').value,
    PrevDue: document.getElementById('prevdue').value,
    Remark: document.getElementById('remark').value,

  };

  const id = document.getElementById('CustID').value;
  const actVal = document.getElementById('act').value;

    console.log(JSON.stringify(Cust));
  let res;
 try {
	  if(actVal=='1')
	  {
		if (!id) { setMessage('No record selected for Update.', true); return; }
		if (!confirm('Are you sure want to Update Record?')) return;
		// update
		res = await fetch(`/api/customers/${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(Cust)
		});
		 alert("Record Updated Successfully.");
		 setBlank();
	  }
	  else if(actVal=='2')
	  {
		if (!id) { setMessage('No record selected for Delete.', true); return; }
		if (!confirm('Are you sure want to Delete Record?')) return;
		  // delete
		res = await fetch(`/api/customers/${id}`, {
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
		res = await fetch('/api/customers', {
		  method: 'POST',
		  headers: { 'Content-Type': 'application/json' },
		  body: JSON.stringify(Cust)
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
	 document.getElementById('CustID').value ="";
	 
    document.getElementById('CustName').value ="";
    document.getElementById('Contact').value="";
    document.getElementById('address').value="";
    document.getElementById('prevdue').value ="";
	document.getElementById('remark').value ="";
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
		loadSuppliers(ID, actParam);
	  }
}
window.onload = codeAddress;
