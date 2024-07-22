import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import AdminView from "../views/AdminView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/admin",
    name: "admin",
    component: AdminView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// 라우터 가드 추가
router.beforeEach((to, from, next) => {
  console.log("라우터 가드 추가");
  console.log(to);
  if (to.fullPath === "/login") {
    // 인증이 필요하지 않은 페이지
    next();
  } else {
    // 인증이 필요한 페이지인 경우
    if (userIsAuthenticated()) {
      // 사용자가 인증된 경우 페이지에 접근을 허용
      next();
    } else {
      // 사용자가 인증되지 않은 경우 로그인 페이지로 리디렉션
      next("/login");
      //next("/");
    }
  }
});

function userIsAuthenticated() {
  // 사용자 인증 여부를 확인하는 논리를 구현
  // 예: 인증 토큰이 있는지 확인
  const token = localStorage.getItem("token");
  return !!token; // 토큰이 존재하면 인증된 것으로 처리
}

export default router;
