const form = document.getElementById('accountForm');
const message = document.getElementById('message');

const urlParams = new URLSearchParams(window.location.search);
const ID = urlParams.get('accID');
const actParam = urlParams.get('act'); // undefined | "1" (update) | "2" (delete)
//console.log('ID :' + ID + ' Action :'+actParam);
let currentAct = ""; // "" create, "1" update, "2" delete

async function loadForm(id, act) {
    try {
        const res = await fetch(`/api/account/${id}`);
        if (!res.ok) {
        setMessage('Record not found..', true);
        return;
        }
        const data = await res.json();
        
        document.getElementById('act').value = act;
       
        document.getElementById('accID').value = id;
        document.getElementById('accName').value = data.accName || '';

        const accType= data.accType ||'';
        const AccTypes = ["-- Select Type --","Business","Personal","Salary","Commission","Over Head","Transport","Miscellaneous"];
        let at= document.getElementById('accType');
        var opt='';
        var selected="";
        var i=0;
        AccTypes.forEach(aType => {
            selected = (accType==i) ? "selected" : "";
            opt= opt + '<option value="'+i+'" '+selected+'>'+aType+'</option>';
            i=i+1;
        });
        at.innerHTML=opt;
        
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
            document.getElementById('accName').style.border = document.getElementById('Remark').style.border;
            document.getElementById('accType').style.border = document.getElementById('Remark').style.border;
        }

     } catch (err) {
        console.error(err);
        setMessage('Error loading Record', true);
    }

   
}

function validateForm() {
  let ok = true;
 
   const accNm= document.getElementById('accName');
   if (accNm=="")
   {
        document.getElementById('accName').style.border = "2px red solid";
        ok = false;
   }
   var options = document.getElementById("accType").options;
   	if( options[0].selected == true)
    {
        document.getElementById('accType').style.border = "2px red solid";
        ok = false;
    }
  return ok;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
   if (!validateForm()) return;
  const data = {
    accName: document.getElementById('accName').value,
    accType: document.getElementById('accType').value,
    Remark: document.getElementById('Remark').value,
  };

  const id = document.getElementById('accID').value;
  const actVal = document.getElementById('act').value;

    //console.log(JSON.stringify(Cust));
  let res;
 try {
	  if(actVal=='1')
	  {
		if (!id) { setMessage('No record selected for Update.', true); return; }
		if (!confirm('Are you sure want to Update Record?')) return;
		// update
		res = await fetch(`/api/account/${id}`, {
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
		res = await fetch(`/api/account/${id}`, {
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
		res = await fetch('/api/account', {
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
 
  } catch (err) {
    //setMessage('Server error', true);
	return;
  }
});


function setBlank()
{
    loadForm("", "");
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