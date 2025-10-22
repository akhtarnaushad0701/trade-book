const form = document.getElementById('paymentForm');
const message = document.getElementById('message');

const urlParams = new URLSearchParams(window.location.search);
const ID = urlParams.get('pmtID');
const actParam = urlParams.get('act'); // undefined | "1" (update) | "2" (delete)
//console.log('ID :' + ID + ' Action :'+actParam);
let currentAct = ""; // "" create, "1" update, "2" delete

async function loadForm(id, act) {
//console.log("Loading catagory", id, act);

 // if (!id) return;

  try {
    const res = await fetch(`/api/payment/${id}`);
    if (!res.ok) {
      setMessage('Payment Record not found', true);
      return;
    }
    const data = await res.json();
    document.getElementById('pmtID').value = id;
	 document.getElementById('act').value = act;
     const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
 // document.getElementById("pmtDate").value = formattedDate;
 
    document.getElementById('pmtDate').value = data.pmtDate ||formattedDate;
    
     const res1 = await fetch('/api/customers');
    if (!res1.ok) {
      setMessage('Customers not found', true);
      return;
    }
    const data1 = await res1.json();

    let CustNm= document.getElementById('CustName');
    var opt='<option value="0">-- Select Customer --</option>';
    data1.forEach(row => {
   
		var selected="";
    selected= row.CustID==data.CustID ? "selected" : "";
		opt= opt + '<option value="'+row.CustID+'" '+selected+'>'+row.CustName+'</option>';
		
  });
    CustNm.innerHTML=opt;


    document.getElementById('pmtAmount').value = data.pmtAmount || '';
    document.getElementById('Remark').value = data.Remark || '';
  
	
   

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
      document.getElementById('CustName').style.border =  document.getElementById('Remark').style.border;
    }

  } catch (err) {
    console.error(err);
    setMessage('Error loading Record..', true);
  }
}

function validateForm() {
  let ok = true;
 
   //const catId= document.getElementById('catID');
   var options = document.getElementById("CustName").options;
   	if( options[0].selected == true)
    {
        document.getElementById('CustName').style.border = "2px red solid";
        ok = false;
    }
  return ok;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
   if (!validateForm()) return;
  const data = {
    pmtDate: document.getElementById('pmtDate').value,
    CustID: document.getElementById('CustName').value,
    pmtAmount: document.getElementById('pmtAmount').value,
    Remark: document.getElementById('Remark').value,
  
  };

  const id = document.getElementById('pmtID').value;
  const actVal = document.getElementById('act').value;

    //console.log(JSON.stringify(Cust));
  let res;
 try {
	  if(actVal=='1')
	  {
		if (!id) { setMessage('No record selected for Update.', true); return; }
		if (!confirm('Are you sure want to Update Record?')) return;
		// update
		res = await fetch(`/api/payment/${id}`, {
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
		res = await fetch(`/api/payment/${id}`, {
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
		res = await fetch('/api/payment', {
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
