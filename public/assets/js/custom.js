//owl carousel

$(document).ready(function() {
    $("#owl-demo").owlCarousel({
        navigation : true,
        slideSpeed : 300,
        paginationSpeed : 400,
        singleItem : true,
        autoPlay:true

    });
});
$(function () {
  // Initialize datepicker
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 10;
  $(".datepicker").datepicker({
      dateFormat: "dd-mm-yy", // optional
      changeMonth: true,
      changeYear: true,
      yearRange: startYear + ":" + currentYear,    
  });

  // Trigger datepicker on icon click
  $(".calendar-icon").on("click", function () {
      $(this).siblings("input.datepicker").datepicker("show");
  });
});
//custom select box
document.addEventListener('DOMContentLoaded', function () {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(function (tooltipTriggerEl) {
        new bootstrap.Tooltip(tooltipTriggerEl);
    });
});
