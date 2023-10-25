export const loadMoreMixins = {
  directives: {
    "el-select-loadmore": {
      beforeMount(el, binding) {
        const SELECTWRAP_DOM = document.querySelector(
          `.${binding.arg}.select-loadmore .el-select-dropdown .el-select-dropdown__wrap`
        );

        if (!SELECTWRAP_DOM) return;
        SELECTWRAP_DOM.addEventListener("scroll", function () {
          const condition =
            Math.round(this.scrollHeight - this.scrollTop) <= this.clientHeight;
          if (condition) {
            binding.value();
          }
        });
      },
    },
  },
};
