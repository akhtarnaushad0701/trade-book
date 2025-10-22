async function loadForm() {
  const res = await fetch('/api/catagory');
  const data = await res.json();
 const tbody = document.getElementById('catagoryBody');
  tbody.innerHTML = ''; // clear old data

  data.forEach(cat => {
    const tr = document.createElement('tr');
		tr.setAttribute("onclick", "SelectRow(this)");
		tr.innerHTML = `
		  <td style='display: none'>${cat.catID}</td>
		  <td>${cat.catName}</td>
		  <td>${cat.quality}</td>
		  <td>${cat.remarks}</td>
		 
		`;
		tbody.appendChild(tr);
  });
}


	
// Initial load
document.addEventListener('DOMContentLoaded', loadForm);
