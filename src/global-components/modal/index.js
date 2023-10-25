import {
  h,
  ref,
  inject,
  onMounted,
  defineComponent,
  resolveDirective,
  withDirectives,
} from "vue";
import dom from "@/utils/js/dom";
import "@/utils/js/model";

const init = (el, { props, emit }) => {
  const modal = tailwind.Modal.getOrCreateInstance(el);
  if (props.show) {
    modal.show();
  } else {
    modal.hide();
  }

  if (el["__initiated"] === undefined) {
    el["__initiated"] = true;

    el.addEventListener(
      "show.tw.modal",
      () => {
        emit("show");
      },
      { passive: true }
    );

    el.addEventListener(
      "shown.tw.modal",
      () => {
        emit("shown");
      },
      { passive: true }
    );

    el.addEventListener(
      "hide.tw.modal",
      () => {
        emit("hide");
      },
      { passive: true }
    );

    el.addEventListener(
      "hidden.tw.modal",
      () => {
        emit("hidden");
      },
      { passive: true }
    );
  }
};

// Modal wrapper
const Modal = defineComponent({
  name: "Modal",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: "",
    },
    backdrop: {
      type: String,
      default: "",
    },
    slideOver: {
      type: Boolean,
      default: false,
    },
    refKey: {
      type: String,
      default: null,
    },
  },
  directives: {
    modal: {
      mounted(el, { value }) {
        dom(el).attr("id", "_" + Math.random().toString(36).substr(2, 9));
        init(el, value);
      },
      updated(el, { value }) {
        init(el, value);
      },
    },
  },
  setup(props, { slots, attrs, emit }) {
    const modalRef = ref();
    const bindInstance = () => {
      if (props.refKey) {
        const bind = inject(`bind[${props.refKey}]`);
        if (bind) {
          bind(tailwind.Modal.getOrCreateInstance(modalRef.value));
        }
      }
    };

    onMounted(() => {
      bindInstance();
    });

    const modalDirective = resolveDirective("modal");

    return () =>
      withDirectives(
        h(
          "div",
          {
            class: ["modal", { "modal-slide-over": props.slideOver }],
            tabindex: "-1",
            "aria-hidden": "true",
            "data-tw-backdrop": props.backdrop,
            ref: modalRef,
          },
          [
            h(
              "div",
              {
                class: ["modal-dialog", props.size],
              },
              [
                h(
                  "div",
                  {
                    class: "modal-content",
                  },
                  slots.default({
                    dismiss: () => {
                      tailwind.Modal.getOrCreateInstance(modalRef.value).hide();
                    },
                  })
                ),
              ]
            ),
          ]
        ),
        [[modalDirective, { props, emit }]]
      );
  },
});

// Modal header
const ModalHeader = defineComponent({
  name: "ModalHeader",
  setup(props, { slots, attrs, emit }) {
    return () =>
      h(
        "div",
        {
          class: "modal-header",
        },
        slots.default()
      );
  },
});

// Modal body
const ModalBody = defineComponent({
  name: "ModalBody",
  setup(props, { slots, attrs, emit }) {
    return () =>
      h(
        "div",
        {
          class: "modal-body",
        },
        slots.default()
      );
  },
});

// Modal footer
const ModalFooter = defineComponent({
  name: "ModalFooter",
  setup(props, { slots, attrs, emit }) {
    return () =>
      h(
        "div",
        {
          class: "modal-footer",
        },
        slots.default()
      );
  },
});

export { Modal, ModalHeader, ModalBody, ModalFooter };
