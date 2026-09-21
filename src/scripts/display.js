(function(){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    },{threshold:0.18, rootMargin:'0px 0px -8% 0px'});

    document.querySelectorAll('.reveal, .chapter, .timeline').forEach(function(el){
      io.observe(el);
    });
  })();