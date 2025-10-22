async function loadSuppliers() {
  const res = await fetch('/api/customers');
  const data = await res.json();
 const tbody = document.getElementById('customerBody');
  tbody.innerHTML = ''; // clear old data

  data.forEach(Cust => {
    const tr = document.createElement('tr');
		tr.setAttribute("onclick", "SelectRow(this)");
		tr.innerHTML = `
		  <td style='display: none'>${Cust.CustID}</td>
		  <td>${Cust.CustName}</td>
		  <td>${Cust.Contact}</td>
		  <td>${Cust.Address}</td>
		  <td>${Cust.PrevDue}</td>
		  <td>${Cust.Remark}</td>
		`;
		tbody.appendChild(tr);
  });
}


	
// Initial load
document.addEventListener('DOMContentLoaded', loadSuppliers);
