"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "../../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Link,
  List,
  ListOrdered,
  Redo2,
  Undo2,
} from "lucide-react";
import Underline from "@tiptap/extension-underline";
import LinkExtension from "@tiptap/extension-link";
import { TableKit } from "@tiptap/extension-table";
import { useState } from "react";
import TextAlign from "@tiptap/extension-text-align";

export default function TextEditor({
  placeholder,
  formField,
  defaultValue,
}: {
  placeholder?: string;
  formField?: {
    value?: string | null;
    onChange?: (value: string | null) => void;
  };
  defaultValue?: string | null;
}) {
  const [content, setContent] = useState(
    defaultValue || formField?.value || ""
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      LinkExtension,
      TableKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: content,
    autofocus: false,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
      if (editor.isEmpty) formField?.onChange?.(null);
      else formField?.onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        placeholder: placeholder || "Write something...",
        class: "overflow-y-auto px-3 py-2 max-h-[300px] focus:outline-none",
        role: "textbox",
        spellcheck: "true",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="bg-background dark:bg-input rounded-md border overflow-hidden">
      <div className="cursor-text">
        <EditorContent
          editor={editor}
          className="prose prose-p:my-3 prose-sm prose-a:text-blue-800 max-w-none"
        />
      </div>

      <div className="flex flex-wrap justify-between gap-1 bg-accent text-accent-foreground px-2 py-1">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="size-6 text-sm rounded-full"
            type="button"
            disabled={!editor.can().undo()}
            onClick={() => editor.chain().focus().undo().run()}
          >
            <Undo2 className="size-4" />
          </Button>
          <Button
            variant="outline"
            type="button"
            size="icon"
            className="size-6 text-sm rounded-full"
            disabled={!editor.can().redo()}
            onClick={() => editor.chain().focus().redo().run()}
          >
            <Redo2 className="size-4" />
          </Button>

          {/* Headings */}
          <Select
            defaultValue={editor.isActive("heading", { level: 1 }) ? "h1" : "p"}
            onValueChange={(value) => {
              const chain = editor.chain().focus();
              if (value === "h1") chain.toggleHeading({ level: 1 }).run();
              else if (value === "h2") chain.toggleHeading({ level: 2 }).run();
              else if (value === "h3") chain.toggleHeading({ level: 3 }).run();
              else if (value === "h4") chain.toggleHeading({ level: 4 }).run();
              else if (value === "h5") chain.toggleHeading({ level: 5 }).run();
              else if (value === "p") chain.setParagraph().run();
            }}
          >
            <SelectTrigger className="px-3 py-1 text-sm">
              <SelectValue placeholder="Select heading" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="p">Paragraph</SelectItem>
              <SelectItem value="h1">Heading 1</SelectItem>
              <SelectItem value="h2">Heading 2</SelectItem>
              <SelectItem value="h3">Heading 3</SelectItem>
              <SelectItem value="h4">Heading 4</SelectItem>
              <SelectItem value="h5">Heading 5</SelectItem>
            </SelectContent>
          </Select>

          {/* Bold */}
          <Button
            type="button"
            variant={editor.isActive("bold") ? "outline" : "ghost"}
            onClick={() => editor.chain().focus().toggleBold().run()}
            size="icon"
            className="size-6 text-sm rounded-full"
          >
            B
          </Button>

          {/* Italic */}
          <Button
            type="button"
            variant={editor.isActive("italic") ? "outline" : "ghost"}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            size="icon"
            className="size-6 text-sm rounded-full"
          >
            I
          </Button>

          {/* Underline */}
          <Button
            type="button"
            variant={editor.isActive("underline") ? "outline" : "ghost"}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            size="icon"
            className="size-6 text-sm rounded-full underline"
          >
            U
          </Button>

          {/* Toggle Text Align */}
          <Button
            type="button"
            variant={
              editor.isActive({ textAlign: "left" }) ? "outline" : "ghost"
            }
            onClick={() => {
              if (editor.isActive({ textAlign: "left" })) {
                editor.chain().focus().setTextAlign("center").run();
              } else if (editor.isActive({ textAlign: "center" })) {
                editor.chain().focus().setTextAlign("right").run();
              } else {
                editor.chain().focus().setTextAlign("left").run();
              }
            }}
            size="icon"
            className="size-6 text-sm rounded-full"
          >
            {editor.isActive({ textAlign: "left" }) ? (
              <AlignLeft className="size-4" />
            ) : editor.isActive({ textAlign: "center" }) ? (
              <AlignCenter className="size-4" />
            ) : (
              <AlignRight className="size-4" />
            )}
          </Button>

          {/* Link */}
          <Button
            type="button"
            variant={editor.isActive("link") ? "outline" : "ghost"}
            onClick={() => {
              const previousUrl = editor.getAttributes("link").href;
              const url = window.prompt("URL", previousUrl);

              if (url === null) return;
              if (url === "") {
                editor.chain().focus().unsetLink().run();
                return;
              }

              editor
                .chain()
                .focus()
                .extendMarkRange("link")
                .setLink({ href: url })
                .run();
            }}
            size="icon"
            className="size-6 text-sm rounded-full"
          >
            <Link className="size-4" />
          </Button>

          {/* Lists */}
          <Button
            type="button"
            variant={editor.isActive("bulletList") ? "outline" : "ghost"}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            size="icon"
            className="size-6 text-sm rounded-full"
          >
            <List className="size-4" />
          </Button>

          <Button
            type="button"
            variant={editor.isActive("orderedList") ? "outline" : "ghost"}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            size="icon"
            className="size-6 text-sm rounded-full"
          >
            <ListOrdered className="size-4" />
          </Button>

          {/* <YoutubeEditor editor={editor} /> */}
        </div>
      </div>
    </div>
  );
}

// const YoutubeEditor = ({ editor }: { editor: Editor }) => {
//   const [height, setHeight] = useState(480);
//   const [width, setWidth] = useState(640);

//   if (!editor) {
//     return null;
//   }

//   const addYoutubeVideo = () => {
//     const url = prompt("Enter YouTube URL");

//     if (url) {
//       editor.commands.setYoutubeVideo({
//         src: url,
//         width: Math.max(320, width) || 640,
//         height: Math.max(180, height) || 480,
//       });
//     }
//   };

//   return (
//     <div className="control-group">
//       <div className="button-group">
//         <input
//           id="width"
//           type="number"
//           min="320"
//           max="1024"
//           placeholder="width"
//           value={width}
//           onChange={(event) => setWidth(parseInt(event.target.value))}
//         />
//         <input
//           id="height"
//           type="number"
//           min="180"
//           max="720"
//           placeholder="height"
//           value={height}
//           onChange={(event) => setHeight(parseInt(event.target.value))}
//         />
//         <button id="add" onClick={addYoutubeVideo}>
//           Add YouTube video
//         </button>
//       </div>
//     </div>
//   );
// };
