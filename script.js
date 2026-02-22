const links = document.querySelectorAll('.menu-link');
const sections = document.querySelectorAll('.page-section');
const backBtn = document.getElementById('backBtn');

// 页面跳转与锚点逻辑
function navTo(targetId) {
    // 判断是跳转完整页面 (page-) 还是页面内锚点滚动 (project-)
    if (targetId.startsWith('page-')) {
        sections.forEach(sec => sec.classList.remove('is-active'));
        document.getElementById(targetId).classList.add('is-active');
        window.scrollTo(0, 0);
        
        // Back 按钮仅在游戏页显示，首页不显示
        backBtn.style.display = targetId === 'page-home' ? 'none' : 'block';
        
    } else if (targetId.startsWith('project-')) {
        // 如果点击的是项目锚点，确保回到首页视图
        sections.forEach(sec => sec.classList.remove('is-active'));
        document.getElementById('page-home').classList.add('is-active');
        backBtn.style.display = 'none';
        
        // 延迟触发滚动，确保页面 DOM 已显示完成
        setTimeout(() => {
            const targetElement = document.getElementById(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 50);
    }
    
    // 更新菜单激活状态
    links.forEach(link => {
        link.classList.toggle('active', link.dataset.target === targetId);
    });
}

// 绑定菜单点击
links.forEach(link => {
    link.addEventListener('click', (e) => {
        navTo(e.target.dataset.target);
    });
});

// 绑定返回首页
backBtn.addEventListener('click', () => {
    navTo('page-home');
});