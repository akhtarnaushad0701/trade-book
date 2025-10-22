import { runQuery } from './js/db.js';
const form = document.getElementById('saleinvoiceForm');
const message = document.getElementById('message');


/* ---------- parse URL params for ID & act ---------- */
const urlParams = new URLSearchParams(window.location.search);
const ID = urlParams.get('sID');
const actParam = urlParams.get('act'); // undefined | "1" (update) | "2" (delete)
//console.log('ID :' + ID + ' Action :'+actParam);
let currentAct = ""; // "" create, "1" update, "2" delete

async function loadForm(id, act) {
//console.log("Loading catagory", id, act);

 // if (!id) return;
//id=4;
  try {
     document.getElementById('saleID').value = id;
     document.getElementById('act').value =act;

      let custId="";
      let totalAmt="";
      let remarks="";
      let saleDate="";
      let sales_items = [];
      let sTrnids="";
      let catID ="";
      let subcatID="";
      let qnty="" ;
      let sPrice ="";
      let amount="" ;  
      let sql = `SELECT si.sale_id, DATE_FORMAT(si.sale_date,'%Y-%m-%d') as sale_date,si.CustID,
            c.CustName, si.sale_tot, si.remarks,s.sTrnid,s.catID, CONCAT(cat.catName,' ',cat.quality) AS catName,
            s.subcatID, sub.subcatNm, s.qnty, s.sPrice, s.sAmount
            FROM salesinv_items s 
            LEFT JOIN catagory cat ON s.catID=cat.catID
            LEFT JOIN subcatagory sub ON s.subcatID=sub.subcatID
            LEFT JOIN salesinv si ON s.sale_id=si.sale_id
            LEFT JOIN customers c ON si.CustID=c.CustID WHERE s.sale_id=${id} ORDER BY s.sTrnid`;
          if(id)
          {
            const rows = await runQuery(sql);
            console.log('rows.length : '+rows.length);
            if(rows.length>0)
            {
              rows.forEach(row => {
                
                custId = row.CustID;
                saleDate = row.sale_date;
                totalAmt  = row.sale_tot;
                remarks = row.remarks;
                sales_items=row.CustName;
                sTrnids=row.sTrnid;
                catID=row.catID;
                subcatID=row.subcatID;
                qnty=row.qnty;
                sPrice=row.sPrice;
                amount=row.sAmount; 
                addRows(sTrnids,catID,subcatID,qnty,sPrice,amount);
              });
            }
           
          } else{ addRows("","","","","",""); }
          
          const today = new Date();
          const formattedDate = today.toISOString().split('T')[0];
    
          document.getElementById('saleDate').value = saleDate ||formattedDate;
          let CustNm=document.getElementById('CustName');
          let  opt = '<option value="0">-- Select Customer --</option>';
          sql = "SELECT CustID,CustName FROM customers";
          const rows2 = await runQuery(sql);
          rows2.forEach(row => {
            const selected = (custId == row.CustID) ? "selected" : "";
          opt += `<option value="${row.CustID}" ${selected}>${row.CustName}</option>`;
          });
          CustNm.innerHTML = opt;
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

  const id = document.getElementById('saleID').value;
  const actVal = document.getElementById('act').value;
  const invoice= {
    sale_date: document.getElementById('saleDate').value,
    CustID: document.getElementById('CustName').value,
    sale_tot: document.getElementById('totalAmt').value,
    remarks: document.getElementById('remarks').value,
  };

  const rows = document.querySelectorAll("#t-body tr");
  const items = [];

  rows.forEach((row, i) => {
    const idx = i + 1; // assuming IDs are like catID_1, catID_2, etc.
    console.log("idx : "+idx);

    
    const sTrnid   = document.getElementById(`sTrnid_${idx}`)?.value;
    const catID    = document.getElementById(`catID_${idx}`)?.value;
    const subcatID = document.getElementById(`subcatID_${idx}`)?.value;
    const stock    = document.getElementById(`stock_${idx}`)?.value;
    const qty      = document.getElementById(`qnty_${idx}`)?.value;
    const price    = document.getElementById(`rate_${idx}`)?.value;
    const amount   = document.getElementById(`amount_${idx}`)?.value;

    
    console.log("sTrnid : "+sTrnid);
    console.log("catID : "+catID);
    console.log("subcatID : "+subcatID);
    console.log("stock : "+stock);
    console.log("qty : "+qty);
    console.log("price : "+price);
    console.log("amount : "+amount);

    // Only push if product is selected
    if (subcatID && subcatID !== "0") {
      items.push({
        sTrnid: sTrnid || "",
        catID: parseInt(catID),
        subcatID: parseInt(subcatID),
        stock: stock || "",
        qnty: parseFloat(qty),
        sPrice: parseFloat(price),
        sAmount: parseFloat(amount)
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
      fetch("/api/sales", {
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
      fetch("/api/sales", {
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
		fetch("/api/sales", {
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
