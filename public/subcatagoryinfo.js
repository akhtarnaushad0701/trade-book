async function loadForm() {
  const res = await fetch('/api/subcatagory/get-SubCatWithJoin');
  const data = await res.json();
 const tbody = document.getElementById('subcatagoryBody');

 
  tbody.innerHTML = ''; // clear old data

  data.forEach(row => {
    const tr = document.createElement('tr');
		tr.setAttribute("onclick", "SelectRow(this)");
		tr.innerHTML = `
		  <td style='display: none'>${row.subcatID}</td>
		  <td style='text-align:left'>${row.catName}</td>
		  <td style='text-align:left'>${row.subcatNm}</td>
		  <td style='text-align:right'>${row.subcatRate}</td>
		  <td style='text-align:left'>${row.Locality}</td>
		`;
		tbody.appendChild(tr);
  });
  
}


	
// Initial load
document.addEventListener('DOMContentLoaded', loadForm);