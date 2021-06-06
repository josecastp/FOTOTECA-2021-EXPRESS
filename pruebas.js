
var array = [
    {
      fecha: "2021-06-17",
      titulo: 'HALLOWEEN',
     
    },
    {
      fecha: "2020-07-09",
      titulo: 'SIMPSON',
     
    },
    {
      fecha: "2024-07-18",
      titulo: 'EDDIE',
    
    }
  ];
  

array.sort(function(a,b){
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.

    return new Date(b.fecha) - new Date(a.fecha);
  });
  console.log(array);
  