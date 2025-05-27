window.onscroll = () => {
    let current = "";
    for (const section of document.getElementsByTagName('section')) {
        if (window.scrollY >= section.offsetTop - window.innerHeight * 0.45) {
            current = section.id;
        }
    }

    const active = document.querySelector('.navbar .nav-item .nav-link.active');
    if (active != null && active.href !== `#${current}`) active.classList.remove('active');

    if (active == null || active.href !== `#${current}`) {
        const link = document.querySelector(`.navbar .nav-item .nav-link[href="#${current}"]`)
        if (link != null) link.classList.add('active');
    }
};

document.querySelectorAll('.navbar a.navbar-brand, #navbarResponsive .nav-item .nav-link').forEach(link => {
    link.addEventListener('click', (evt) => {
        const navbar = bootstrap.Collapse.getInstance(document.querySelector('#navbarResponsive'));
        if (navbar != null) navbar.hide();
    });
});

function orderqr(evt) {
    evt.preventDefault();
    const orderurl = document.querySelector('#orderurl').value.trim();
    if (orderurl && orderurl !== "") {
        document.querySelector('#orderqr').setAttribute('src', "https://api.qrserver.com/v1/create-qr-code/?format=svg&qzone=1&bgcolor=249-247-241&color=49-21-62&data=" + encodeURIComponent(orderurl));
        document.querySelector('#orderurl').blur();
    }
}
