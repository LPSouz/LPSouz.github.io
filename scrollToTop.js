function scrollToTop() {
    window.scrollTo(
        {
            top: 0,
            behavior: 'smooth'
        });

    window.addEventListener('scroll', () =>{
        const btnTopo = document.querySelector('.btnTopo');
        btnTopo.style.display = window.pageYOffset > 100 ? 'block' : 'none';
    });

    btnTopo.addEventListener('click',scrollToTop);
}