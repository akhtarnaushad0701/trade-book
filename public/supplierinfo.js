
const form = document.getElementById('supplierForm');
const list = document.getElementById('supplierBody');



async function loadSuppliers() {
  const res = await fetch('/api/suppliers');
  const data = await res.json();
 const tbody = document.getElementById('supplierBody');
  tbody.innerHTML = ''; // clear old data

  data.forEach(sup => {
    const tr = document.createElement('tr');
		tr.setAttribute("onclick", "SelectRow(this)");
		tr.innerHTML = `
		  <td style='display: none'>${sup.supID}</td>
		  <td>${sup.supName}</td>
		  <td>${sup.supContact}</td>
		  <td>${sup.supAdd}</td>
		  <td>${sup.supRemark}</td>
		`;
		tbody.appendChild(tr);
  });
}


	
// Initial load
document.addEventListener('DOMContentLoaded', loadSuppliers);
