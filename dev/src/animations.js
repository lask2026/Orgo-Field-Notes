export function applyPreferences(state){
  document.documentElement.dataset.theme=state.theme;
  document.body.classList.toggle('no-anim',!state.animations||matchMedia('(prefers-reduced-motion: reduce)').matches);
}
