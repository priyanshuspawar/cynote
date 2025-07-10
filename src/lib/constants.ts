import client1 from "../../public/client1.png";
import client2 from "../../public/client2.png";
import client3 from "../../public/client3.png";
import client4 from "../../public/client4.png";
import client5 from "../../public/client5.png";

export const CLIENTS = [
  { alt: "client1", logo: client1 },
  { alt: "client2", logo: client2 },
  { alt: "client3", logo: client3 },
  { alt: "client4", logo: client4 },
  { alt: "client5", logo: client5 },
];

export const USERS = [
  {
    name: "Alice",
    message:
      "Cynote has been a game-changer for our team. With its reliable end-to-end testing, we catch bugs early, leading to faster development cycles and improved collaboration.",
  },
  {
    name: "Bob",
    message:
      "I used to spend hours debugging frontend issues, but Cynote simplified everything. Now, I'm more productive, and my colleagues can trust our code thanks to Cynote.",
  },
  {
    name: "Charlie",
    message:
      "Cynote has transformed the way we work. Our QA and development teams are on the same page, and our productivity has skyrocketed. It's a must-have tool.",
  },
  {
    name: "David",
    message:
      "I was skeptical at first, but Cynote exceeded my expectations. Our project timelines have improved, and collaboration between teams is seamless.",
  },
  {
    name: "Ella",
    message:
      "Cynote made writing and running tests a breeze. Our team's productivity has never been higher, and we're delivering more reliable software.",
  },
  {
    name: "Frank",
    message:
      "Thanks to Cynote, we've eliminated testing bottlenecks. Our developers and testers collaborate effortlessly, resulting in quicker releases.",
  },
  {
    name: "Grace",
    message:
      "Cynote has improved our development process significantly. We now have more time for innovation, and our products are of higher quality.",
  },
  {
    name: "Hank",
    message:
      "Cynote's user-friendly interface made it easy for our non-technical team members to contribute to testing. Our workflow is much more efficient now.",
  },
  {
    name: "Ivy",
    message:
      "Our team's collaboration improved immensely with Cynote. We catch issues early, leading to less friction and quicker feature deployments.",
  },
  {
    name: "Jack",
    message:
      "Cynote's robust testing capabilities have elevated our development standards. We work more harmoniously, and our releases are more reliable.",
  },
  {
    name: "Katherine",
    message:
      "Cynote is a lifesaver for our cross-functional teams. We're more productive, and there's a shared sense of responsibility for product quality.",
  },
  {
    name: "Liam",
    message:
      "Cynote has helped us maintain high standards of quality. Our team's collaboration has improved, resulting in faster development cycles.",
  },
  {
    name: "Mia",
    message:
      "Cynote is a powerful tool that improved our productivity and collaboration. It's now an integral part of our development process.",
  },
  {
    name: "Nathan",
    message:
      "Cynote's user-friendly interface and detailed reporting have made testing a breeze. Our team's productivity is at an all-time high.",
  },
  {
    name: "Olivia",
    message:
      "We saw immediate benefits in terms of productivity and collaboration after adopting Cynote. It's an essential tool for our development workflow.",
  },
  {
    name: "Paul",
    message:
      "Cynote has streamlined our testing process and brought our teams closer. We're more efficient and deliver better results.",
  },
  {
    name: "Quinn",
    message:
      "Cynote has been a game-changer for us. Our productivity and collaboration have improved significantly, leading to better software.",
  },
  {
    name: "Rachel",
    message:
      "Thanks to Cynote, our testing process is now a seamless part of our development cycle. Our teams collaborate effortlessly.",
  },
  {
    name: "Sam",
    message:
      "Cynote is a fantastic tool that has revolutionized our workflow. Our productivity and collaboration have reached new heights.",
  },
];

export const PRICING_CARDS = [
  {
    planType: "Free Plan",
    price: "0",
    description: "Limited block trials  for teams",
    highlightFeature: "",
    freatures: [
      "Unlimited blocks for teams",
      "Unlimited file uploads",
      "30 day page history",
      "Invite 2 guests",
    ],
  },
  {
    planType: "Pro Plan",
    price: "12.99",
    description: "Billed annually.",
    highlightFeature: "Everything in free +",
    freatures: [
      "Unlimited blocks for teams",
      "Unlimited file uploads",
      "1 year day page history",
      "Invite 10 guests",
    ],
  },
];

export const PRICING_PLANS = { proplan: "Pro Plan", freeplan: "Free Plan" };

export const MAX_FOLDERS_FREE_PLAN = 3;
export const themeColors = [
  "#fb7185",
  "#fdba74",
  "#d9f99d",
  "#a7f3d0",
  "#a5f3fc",
  "#a5b4fc",
];

export const initialContent = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: {
        textAlign: "left",
        level: 1,
      },
      content: [
        {
          type: "emoji",
          attrs: {
            name: "fire",
          },
        },
        {
          type: "text",
          text: " Next.js + Tiptap Block Editor Template",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        class: null,
        textAlign: "left",
      },
      content: [
        {
          type: "text",
          text: "Welcome to our React Block Editor Template built on top of ",
        },
        {
          type: "text",
          marks: [
            {
              type: "link",
              attrs: {
                href: "https://tiptap.dev/",
                target: "_blank",
                class: null,
              },
            },
          ],
          text: "Tiptap",
        },
        {
          type: "text",
          text: ", ",
        },
        {
          type: "text",
          marks: [
            {
              type: "link",
              attrs: {
                href: "https://nextjs.org/",
                target: "_blank",
                class: null,
              },
            },
          ],
          text: "Next.js",
        },
        {
          type: "text",
          text: " and ",
        },
        {
          type: "text",
          marks: [
            {
              type: "link",
              attrs: {
                href: "https://tailwindcss.com/",
                target: "_blank",
                class: null,
              },
            },
          ],
          text: "Tailwind",
        },
        {
          type: "text",
          text: ". This project can be a good starting point for your own implementation of a block editor.",
        },
      ],
    },
    {
      type: "codeBlock",
      attrs: {
        language: null,
      },
      content: [
        {
          type: "text",
          text: "import { useEditor, EditorContent } from '@tiptap/react'\n\nfunction App() {\n  const editor = useEditor()\n\n  return <EditorContent editor={editor} />\n}",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        class: null,
        textAlign: "left",
      },
      content: [
        {
          type: "text",
          text: "This editor includes features like:",
        },
      ],
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "A DragHandle including a DragHandle menu",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "A Slash menu that can be triggered via typing a ",
                },
                {
                  type: "text",
                  marks: [
                    {
                      type: "code",
                    },
                  ],
                  text: "/",
                },
                {
                  type: "text",
                  text: " into an empty paragraph or by using the ",
                },
                {
                  type: "text",
                  marks: [
                    {
                      type: "bold",
                    },
                  ],
                  text: "+ Button",
                },
                {
                  type: "text",
                  text: " next to the drag handle",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "A TextFormatting menu that allows you to change the ",
                },
                {
                  type: "text",
                  marks: [
                    {
                      type: "textStyle",
                      attrs: {
                        fontSize: "18px",
                        fontFamily: null,
                        color: null,
                      },
                    },
                  ],
                  text: "font size",
                },
                {
                  type: "text",
                  text: ", ",
                },
                {
                  type: "text",
                  marks: [
                    {
                      type: "bold",
                    },
                  ],
                  text: "font weight",
                },
                {
                  type: "text",
                  text: ", ",
                },
                {
                  type: "text",
                  marks: [
                    {
                      type: "textStyle",
                      attrs: {
                        fontSize: null,
                        fontFamily: "Georgia",
                        color: null,
                      },
                    },
                  ],
                  text: "font family",
                },
                {
                  type: "text",
                  text: ", ",
                },
                {
                  type: "text",
                  marks: [
                    {
                      type: "textStyle",
                      attrs: {
                        fontSize: null,
                        fontFamily: null,
                        color: "#b91c1c",
                      },
                    },
                  ],
                  text: "color",
                },
                {
                  type: "text",
                  text: ", ",
                },
                {
                  type: "text",
                  marks: [
                    {
                      type: "highlight",
                      attrs: {
                        color: "#7e7922",
                      },
                    },
                  ],
                  text: "highlight",
                },
                {
                  type: "text",
                  text: " and more",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "A Table of Contents that can be viewed via clicking on the button on the top left corner",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "Live collaboration including content synchronization and collaborative cursors",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "AI implementation with text and image generation and auto completion via the ",
                },
                {
                  type: "text",
                  marks: [
                    {
                      type: "code",
                    },
                  ],
                  text: "TAB",
                },
                {
                  type: "text",
                  text: " key.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "imageBlock",
      attrs: {
        src: "/placeholder-image.jpg",
        width: "100%",
        align: "center",
      },
    },
    {
      type: "heading",
      attrs: {
        textAlign: "left",
        level: 2,
      },
      content: [
        {
          type: "text",
          text: "Get started",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        class: null,
        textAlign: "left",
      },
      content: [
        {
          type: "text",
          text: "To access our block editor template, simply head over to your ",
        },
        {
          type: "text",
          marks: [
            {
              type: "link",
              attrs: {
                href: "https://cloud.tiptap.dev/react-templates",
                target: "_blank",
                class: null,
              },
            },
          ],
          text: "Tiptap Account",
        },
        {
          type: "text",
          text: " If you are not already a member, sign up for an account and complete the 2-minute React Template survey. Once finished, we will send you an invite to the private GitHub repository.",
        },
      ],
    },
    {
      type: "heading",
      attrs: {
        textAlign: "left",
        level: 2,
      },
      content: [
        {
          type: "text",
          text: "Installed extensions",
        },
      ],
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "@tiptap-pro/extension-ai",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "@tiptap-pro/extension-details",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "@tiptap-pro/extension-details-content",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "@tiptap-pro/extension-details-summary",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "@tiptap-pro/extension-drag-handle",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "@tiptap-pro/extension-drag-handle-react",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "@tiptap-pro/extension-emoji",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "@tiptap-pro/extension-file-handler",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "@tiptap-pro/extension-mathematics",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "@tiptap-pro/extension-node-range",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "@tiptap-pro/extension-table-of-contents",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "@tiptap-pro/extension-unique-id",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "@tiptap/extension-bullet-list",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "@tiptap/extension-character-count",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "@tiptap/extension-code-block",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "@tiptap/extension-code-block-lowlight",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "@tiptap/extension-collaboration",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "@tiptap/extension-collaboration-cursor",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "@tiptap/extension-color",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "@tiptap/extension-document",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "@tiptap/extension-dropcursor",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "@tiptap/extension-focus",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "@tiptap/extension-font-family",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "@tiptap/extension-heading",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "@tiptap/extension-highlight",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "@tiptap/extension-horizontal-rule",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "@tiptap/extension-image",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "@tiptap/extension-link",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "@tiptap/extension-ordered-list",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "@tiptap/extension-paragraph",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "@tiptap/extension-placeholder",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "@tiptap/extension-subscript",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "@tiptap/extension-superscript",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "@tiptap/extension-table",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "@tiptap/extension-table-header",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "@tiptap/extension-table-row",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "@tiptap/extension-task-item",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "@tiptap/extension-task-list",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "@tiptap/extension-text-align",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "@tiptap/extension-text-style",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "@tiptap/extension-typography",
                },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: {
                class: null,
                textAlign: "left",
              },
              content: [
                {
                  type: "text",
                  text: "@tiptap/extension-underline",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        class: null,
        textAlign: "left",
      },
    },
  ],
};

export const userNames = [
  "Lea Thompson",
  "Cyndi Lauper",
  "Tom Cruise",
  "Madonna",
  "Jerry Hall",
  "Joan Collins",
  "Winona Ryder",
  "Christina Applegate",
  "Alyssa Milano",
  "Molly Ringwald",
  "Ally Sheedy",
  "Debbie Harry",
  "Olivia Newton-John",
  "Elton John",
  "Michael J. Fox",
  "Axl Rose",
  "Emilio Estevez",
  "Ralph Macchio",
  "Rob Lowe",
  "Jennifer Grey",
  "Mickey Rourke",
  "John Cusack",
  "Matthew Broderick",
  "Justine Bateman",
  "Lisa Bonet",
];

export const userColors = [
  "#fb7185",
  "#fdba74",
  "#d9f99d",
  "#a7f3d0",
  "#a5f3fc",
  "#a5b4fc",
  "#f0abfc",
];

export const SuggestedImages = [
  {
    id: 0,
    imgUrl:
      "https://govwklbidoldosqqvriv.supabase.co/storage/v1/object/public/banners/banner1.png?t=2024-08-25T10%3A55%3A10.629Z",
  },
  {
    id: 1,
    imgUrl:
      "https://govwklbidoldosqqvriv.supabase.co/storage/v1/object/public/banners/banner2.png?t=2024-08-25T10%3A55%3A10.629Z",
  },
  {
    id: 2,
    imgUrl:
      "https://govwklbidoldosqqvriv.supabase.co/storage/v1/object/public/banners/banner3.png?t=2024-08-25T10%3A55%3A10.629Z",
  },
  {
    id: 3,
    imgUrl:
      "https://govwklbidoldosqqvriv.supabase.co/storage/v1/object/public/banners/banner4.png?t=2024-08-25T10%3A55%3A10.629Z",
  },
  {
    id: 4,
    imgUrl:
      "https://govwklbidoldosqqvriv.supabase.co/storage/v1/object/public/banners/banner5.png?t=2024-08-25T10%3A55%3A10.629Z",
  },
  {
    id: 5,
    imgUrl:
      "https://govwklbidoldosqqvriv.supabase.co/storage/v1/object/public/banners/banner6.png?t=2024-08-25T10%3A55%3A10.629Z",
  },
  {
    id: 6,
    imgUrl:
      "https://govwklbidoldosqqvriv.supabase.co/storage/v1/object/public/banners/banner7.png?t=2024-08-25T10%3A55%3A10.629Z",
  },
  {
    id: 7,
    imgUrl:
      "https://govwklbidoldosqqvriv.supabase.co/storage/v1/object/public/banners/banner8.png?t=2024-08-25T10%3A55%3A10.629Z",
  },
  {
    id: 8,
    imgUrl:
      "https://govwklbidoldosqqvriv.supabase.co/storage/v1/object/public/banners/banner9.png?t=2024-08-25T10%3A55%3A10.629Z",
  },
];
