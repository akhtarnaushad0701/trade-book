
import { runQuery } from './js/db.js';
const form = document.getElementById('expenseForm');
const message = document.getElementById('message');

const urlParams = new URLSearchParams(window.location.search);
const ID = urlParams.get('expID');
const actParam = urlParams.get('act'); // undefined | "1" (update) | "2" (delete)
//console.log('ID :' + ID + ' Action :'+actParam);
let currentAct = ""; // "" create, "1" update, "2" delete
async function loadForm(id, act) {
   
      //id=4;
  try {
    // Fetch expense record
   
    const expenseRes = await fetch(`/api/expense/${id}`);
    if (!expenseRes.ok) {
      setMessage('Record not found..', true);
      return;
    }
    const data1 = await expenseRes.json();   // ✅ fixed here
    const expID = data1.expID || '';
    const accID = data1.accID || '';
    const expDate = data1.expDate || '';
    const amount = data1.amount || '';
    const remark = data1.remark || '';

    document.getElementById('act').value = act;
    document.getElementById('expID').value = expID;

    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    
    document.getElementById('expDate').value = expDate ||formattedDate;
    
    // Fetch account type
    const accountRes = await fetch(`/api/account/${accID}`);
    if (!accountRes.ok) {
      setMessage('Record not found..', true);
      return;
    }
    const data = await accountRes.json();
    const accType = data.accType || '0';

    const AccTypes = [
      "-- Select Type --","Business","Personal","Salary",
      "Commission","Over Head","Transport","Miscellaneous"
    ];

    let at = document.getElementById('accType');
    let opt = '';
    AccTypes.forEach((aType, i) => {
      const selected = (accType == i) ? "selected" : "";
      opt += `<option value="${i}" ${selected}>${aType}</option>`;
    });
    at.innerHTML = opt;

    // Fetch accounts list
    let aID = document.getElementById('accID');
    opt = '<option value="0">-- Select Account --</option>';

    let sql = `SELECT accID,accName FROM account WHERE accType=${accType}`;
   const rows = await runQuery(sql);

    rows.forEach(row => {
      const selected = (accID == row.accID) ? "selected" : "";
      opt += `<option value="${row.accID}" ${selected}>${row.accName}</option>`;
    });
    aID.innerHTML = opt;

    document.getElementById('amount').value = amount;
    document.getElementById('remark').value = remark;

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
      
    }

  } catch (err) {
    console.error(err);
   setMessage('Error loading record', true);
  }
}


form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validateForm()) return;
  const data = {
    accID: document.getElementById('accID').value,
    expDate: document.getElementById('expDate').value,
    amount: document.getElementById('amount').value,
    remark:document.getElementById('remark').value,
  };

  const id = document.getElementById('expID').value;
  const actVal = document.getElementById('act').value;

    //console.log(JSON.stringify(Cust));
let res;
 try {
	  if(actVal=='1')
	  {
		if (!id) { setMessage('No record selected for Update.', true); return; }
		if (!confirm('Are you sure want to Update Record?')) return;
		// update
		res = await fetch(`/api/expense/${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
		});
		// alert("Record Updated Successfully.");
		setBlank();
	  }
	  else if(actVal=='2')
	  {
		if (!id) { setMessage('No record selected for Delete.', true); return; }
		if (!confirm('Are you sure want to Delete Record?')) return;
		  // delete
		res = await fetch(`/api/expense/${id}`, {
		method: 'DELETE',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify()
		});
		// alert("Record Deleted Successfully.");  
		 setBlank();
	  }  
	else
	{
		if (!confirm('Are you sure want to Add Record?')) return;
		// insert
		res = await fetch('/api/expense', {
		  method: 'POST',
		  headers: { 'Content-Type': 'application/json' },
		  body: JSON.stringify(data)
		});
		 //alert("Record Saved Successfully.");
		setBlank();
	}

    const result = await res.json();
   alert(result.message);
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