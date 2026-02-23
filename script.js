const links = document.querySelectorAll('.hud-node');
const sections = document.querySelectorAll('.page-section');
const backBtn = document.getElementById('backBtn');
const sideMenu = document.getElementById('sideMenu');
const hudToggle = document.getElementById('hudToggle');

// 初始状态下菜单是收起的
let isMenuCollapsed = false;

// 1. 菜单折叠/展开控制
hudToggle.addEventListener('click', () => {
    isMenuCollapsed = !isMenuCollapsed;
    hudToggle.classList.toggle('is-closed', isMenuCollapsed);
    sideMenu.classList.toggle('is-collapsed', isMenuCollapsed);
});

// 2. 页面跳转与锚点逻辑
function navTo(targetId) {
    if (targetId.startsWith('page-')) {
        // 如果点击的是二级页面 (Home, Thoughts, Gaming)
        sections.forEach(sec => sec.classList.remove('is-active'));
        document.getElementById(targetId).classList.add('is-active');
        window.scrollTo(0, 0);
        
        // 只有离开首页时才显示 BACK 按钮
        backBtn.style.display = targetId === 'page-home' ? 'none' : 'block';
        updateActiveMenu(targetId);
        
    } else if (targetId.startsWith('project-')) {
        // 如果点击的是首页的项目锚点
        sections.forEach(sec => sec.classList.remove('is-active'));
        document.getElementById('page-home').classList.add('is-active');
        backBtn.style.display = 'none';
        
        // 延迟跳转确保 DOM 已渲染完成
        setTimeout(() => {
            const targetElement = document.getElementById(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            updateActiveMenu(targetId);
        }, 50);
    }
}

// 统一控制菜单的高亮状态
function updateActiveMenu(targetId) {
    links.forEach(link => {
        link.classList.toggle('active', link.dataset.target === targetId);
    });
}

// 绑定导航栏点击事件
links.forEach(link => {
    link.addEventListener('click', (e) => {
        navTo(e.currentTarget.dataset.target);
    });
});

// 绑定 BACK 按钮返回首页
backBtn.addEventListener('click', () => {
    navTo('page-home');
});

// 3. 滚动监听 (Scroll Spy) 机制
const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px', 
    threshold: 0
};

// 【修复逻辑】：滚动监听仅监听主界面的 00 到 04 (现在增加06)
const sectionsToObserve = [
    { id: 'about-section', target: 'page-home' },
    { id: 'project-1', target: 'project-1' },
    { id: 'project-2', target: 'project-2' },
    { id: 'project-3', target: 'project-3' },
    { id: 'project-4', target: 'project-4' },
    { id: 'project-5', target: 'project-5' },
    { id: 'project-6', target: 'project-6' },  // 新增项目6
    { id: 'project-7', target: 'project-7' }
];

const observer = new IntersectionObserver((entries) => {
    // 如果当前不在首页，不触发滚动高亮逻辑
    if (!document.getElementById('page-home').classList.contains('is-active')) return;

    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const match = sectionsToObserve.find(s => s.id === entry.target.id);
            if (match) {
                updateActiveMenu(match.target);
            }
        }
    });
}, observerOptions);

// 注册监听器
sectionsToObserve.forEach(item => {
    const el = document.getElementById(item.id);
    if (el) observer.observe(el);
});