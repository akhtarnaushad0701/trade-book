import { runQuery } from './js/db.js';
const form = document.getElementById('purinvoiceForm');
const message = document.getElementById('message');


/* ---------- parse URL params for ID & act ---------- */
const urlParams = new URLSearchParams(window.location.search);
const ID = urlParams.get('pId');
const actParam = urlParams.get('act'); // undefined | "1" (update) | "2" (delete)
//console.log('ID :' + ID + ' Action :'+actParam);
let currentAct = ""; // "" create, "1" update, "2" delete

async function loadForm(id, act) {
//console.log("Loading catagory", id, act);

 // if (!id) return;
//id=4;
  try {
     document.getElementById('purId').value = id;
     document.getElementById('act').value =act;

      let supId="";
      let totalAmt="";
      let remarks="";
      let purDate="";
      let pur_items = [];
      let pTranids="";
      let catID ="";
      let subcatID="";
      let qnty="" ;
      let pRate ="";
      let pAmount="" ;  
    let sql = `SELECT i.pTran_id,i.pur_id,DATE_FORMAT(p.pur_date,'%Y-%m-%d') as pur_date ,p.invoice_no,p.tot_amount,p.remarks,p.supID,s.supName,
				i.catID,CONCAT(c.catName,' ',c.quality) AS catName,i.subcatID,sc.subcatNm,i.qnty,i.pur_rate,i.pur_amount
				FROM purinv_items i
				LEFT JOIN catagory c ON i.catID = c.catID
				LEFT JOIN subcatagory sc ON i.subcatID = sc.subcatID

				LEFT JOIN purinv p ON i.pur_id = p.pur_id
				LEFT JOIN supplier s ON p.supID = s.supID
				WHERE i.pur_id=${id}
				ORDER BY p.pur_date, i.pTran_id`

     
          if(id)
          {
            const rows = await runQuery(sql);
            console.log('rows.length : '+rows.length);
            if(rows.length>0)
            {
              rows.forEach(row => {
                
                supId = row.supID;
                purDate = row.pur_date;
                totalAmt  = row.tot_amount;
                remarks = row.remarks;
                pur_items=row.supName;
                pTranids=row.pTran_id;
                catID=row.catID;
                subcatID=row.subcatID;
                qnty=row.qnty;
                
                pRate=row.pur_rate;
                pAmount=row.pur_amount; 
                addRows(pTranids,catID,subcatID,qnty,pRate,pAmount);
              });
            }
           
          } else{ addRows("","","","","",""); }
          
          const today = new Date();
          const formattedDate = today.toISOString().split('T')[0];
    
          document.getElementById('purDate').value = purDate ||formattedDate;
          let SupNm=document.getElementById('supName');
          let  opt = '<option value="0">-- Select Supplier --</option>';
          sql = "SELECT supID,supName FROM supplier";
          const rows2 = await runQuery(sql);
          rows2.forEach(row => {
            const selected = (supId == row.supID) ? "selected" : "";
          opt += `<option value="${row.supID}" ${selected}>${row.supName}</option>`;
          });

          SupNm.innerHTML = opt;
          document.getElementById('totalAmt').value = totalAmt ||'';
          document.getElementById('remarks').value = remarks ||'';




    if (act === '1') {
      currentAct = '1';
     
      document.getElementById('submitBtn').textContent = '✔ Update';
     document.getElementById('submitBtn').value='✔ Update';
      //setMessage('Record Ready for Update.');
      
    } else if (act === '2') {
      currentAct = '2';
      
      document.getElementById('submitBtn').textContent = '✔ Delete';
     document.getElementById('submitBtn').value='✔ Delete';
     // setMessage('Record Ready for Delete.');
      
    } else {
       document.getElementById('submitBtn').textContent = '✔  Submit';
      document.getElementById('submitBtn').value='✔  Submit';
     // setMessage('Ready for New Record Entry..'); 
      //document.getElementById('catID').style.border =  document.getElementById('Locality').style.border;
    }

  } catch (err) {
    console.error(err);
   // setMessage('Error loading Suppliers', true);
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  const id = document.getElementById('purId').value;
  const actVal = document.getElementById('act').value;
  const invoice= {
    pur_date: document.getElementById('purDate').value,
    supID: document.getElementById('supName').value,
    invoice_no: document.getElementById('PurInv').value,
    tot_amount: document.getElementById('totalAmt').value,
    remarks: document.getElementById('remarks').value,
  };

  const rows = document.querySelectorAll("#t-body tr");
  const items = [];

  rows.forEach((row, i) => {
    const idx = i + 1; // assuming IDs are like catID_1, catID_2, etc.
    console.log("idx : "+idx);

    
    const pTranid   = document.getElementById(`pTrnid_${idx}`)?.value;
    const catID    = document.getElementById(`catID_${idx}`)?.value;
    const subcatID = document.getElementById(`subcatID_${idx}`)?.value;
    
    const qty      = document.getElementById(`qnty_${idx}`)?.value;
    const purrate    = document.getElementById(`rate_${idx}`)?.value;
    const puramount   = document.getElementById(`amount_${idx}`)?.value;

    


    // Only push if product is selected
    if (subcatID && subcatID !== "0") {
      items.push({
        pTran_id: pTranid || "",
        catID: parseInt(catID),
        subcatID: parseInt(subcatID),
        
        qnty: parseFloat(qty),
        pur_rate: parseFloat(purrate),
        pur_amount: parseFloat(puramount)
      });
    }
    
  });

   if (items.length === 0) {
    alert("No products added!");
    return;
  }
 
  let res;
 try {
      if(actVal=='1')
      {
      if (!confirm('Are you sure want to Update Record?')) return;
      // insert
      fetch("/api/purchase", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({invoice, items, id})
      })
      .then(res => res.json())
      .then(data => {
          console.log(data);
          if (data.success) {
            alert(data.message);
            
            new_load();
           // loadForm("", "");
          } else {
            alert("Failed to add record: ");
          }
        })
        .catch(err => console.error("Fetch error:", err));
    
      }
      else if(actVal=='2')
      {
      // Code for Delete record...
      if (!confirm('Are you sure want to Delete Record?')) return;
      // insert
      fetch("/api/purchase", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({id})
      })
      .then(res => res.json())
      .then(data => {
          console.log(data);
          if (data.success) {
            alert(data.message);
            new_load();
           // loadForm("", "");
          } else {
            alert("Failed to add record: ");
          }
        })
        .catch(err => console.error("Fetch error:", err));
      }  
    else
    {
        if (!confirm('Are you sure want to Add Record?')) return;
        // insert
        fetch("/api/purchase", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({invoice,items})
    })
    .then(res => res.json())
    .then(data => {
         console.log(data);
        if (data.success) {
          alert(data.message);
          new_load();
          //loadForm("", "");
        } else {
          alert("Failed to add record: ");
        }
      })
      .catch(err => console.error("Fetch error:", err));
        
    }

  const result = await res.json();
  alert(result.message);
  //form.reset();
  
 
  } catch (err) {
    //setMessage('Server error', true);
    return;
  }
 

  });

  
function codeAddress() {
        
    if (ID) {
        loadForm(ID, actParam);
      }
    else{
      loadForm("", "");
    }
}
window.onload = codeAddress;
