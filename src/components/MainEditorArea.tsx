import React from "react";
import { editor } from "monaco-editor";
import { VscFile } from "react-icons/vsc";

import  { JoinStateType, EditorLanguageKey } from "../types/editor";
import  { RemoteUser } from "../types/props";
import CodeEditor from "./CodeEditor";
import TerminalComponent from "../components/TerminalComponent";
import WebViewPanel from "../components/WebViewPanel";
import FileTabs from "./FileTabs";
import {
  editorLanguageMap,
  languageIconMap,
  languageColorMap,
  defaultIconColor,
} from "../constants/mappings";
import {
  TERMINAL_HANDLE_HEIGHT,
  WEBVIEW_HANDLE_GRAB_WIDTH,
} from "../constants/layout";
import { useFileStore } from "../store/useFileStore";

interface MainEditorAreaProps {
  // Refs
  editorTerminalAreaRef: React.RefObject<HTMLDivElement>;
  tabContainerRef: React.RefObject<HTMLDivElement>;
  terminalRef: any;
  editorInstanceRef: React.MutableRefObject<editor.IStandaloneCodeEditor | null>;

  // Tab Management
  handleSwitchTab: (fileId: string) => void;
  handleCloseTab: (fileIdToClose: string) => void;

  // Editor
  fileContents: { [id: string]: string };
  handleCodeChange: (newCode: string) => void;
  handleEditorDidMount: (editorInstance: editor.IStandaloneCodeEditor) => void;
  currentRemoteUsers: RemoteUser[];
  localUserId: string;

  // Terminal Resizing
  terminalPanelHeight: number;
  isTerminalCollapsed: boolean;
  handleTerminalPanelMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;

  // WebView Resizing & Content
  webViewPanelWidth: number;
  handleWebViewPanelMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  htmlFileContent: string;
  cssFileContent: string;
  jsFileContent: string;
  toggleWebView: () => void;
  isSessionActive: boolean;
  joinState: JoinStateType;
}

const MainEditorArea = ({
  editorTerminalAreaRef,
  tabContainerRef,
  terminalRef,
  handleSwitchTab,
  handleCloseTab,
  fileContents,
  handleCodeChange,
  handleEditorDidMount,
  currentRemoteUsers,
  localUserId,
  terminalPanelHeight,
  isTerminalCollapsed,
  handleTerminalPanelMouseDown,
  webViewPanelWidth,
  handleWebViewPanelMouseDown,
  htmlFileContent,
  cssFileContent,
  jsFileContent,
  toggleWebView,
  isSessionActive,
  joinState,
}: MainEditorAreaProps) => {
  // Get state from Zustand Store
  const { openFiles, activeFileId } = useFileStore();

  // Find the active file object
  const activeFile = openFiles.find((f) => f.id === activeFileId);

  // Determine icon and color for the active file
  let ActiveIconComponent: React.ComponentType<any> = VscFile; // Default icon
  let activeIconColor = defaultIconColor; // Default color

  if (activeFile) {
    ActiveIconComponent =
      languageIconMap[activeFile.language as EditorLanguageKey] || VscFile;
    activeIconColor =
      languageColorMap[activeFile.language as EditorLanguageKey] ||
      defaultIconColor;
  }

  return (
    <div className="flex flex-1 min-w-0 relative">
      <div
        ref={editorTerminalAreaRef}
        className="flex-1 flex flex-col relative overflow-x-hidden min-w-0"
      >
        {/* Tabs */}
        <FileTabs
          tabContainerRef={tabContainerRef}
          handleSwitchTab={handleSwitchTab}
          handleCloseTab={handleCloseTab}
        />

        {/* Breadcrumbs Area - Simplified */}
        <div className="h-6 flex-shrink-0 bg-neutral-900 flex items-center px-2 text-sm text-stone-400 overflow-hidden whitespace-nowrap">
          {activeFile ? (
            <React.Fragment>
              {/* Removed "Project" span and Chevron */}
              {/* File Icon and Name */}
              <ActiveIconComponent
                size={16}
                className={`mr-1 flex-shrink-0 ${activeIconColor}`}
              />
              <span className="text-stone-400">{activeFile.name}</span>
            </React.Fragment>
          ) : (
            <span>
              {/* Optionally show something when no file is active */}
            </span>
          )}
        </div>

        {/* Code Editor Area - Removed pt-4 */}
        <div className="flex-1 overflow-auto font-mono text-sm relative bg-neutral-900 min-h-0">
          {joinState === "prompting" ? (
            <div className="flex items-center justify-center h-full text-stone-500">
              Enter your details in the sidebar to join the session...
            </div>
          ) : activeFileId && openFiles.find((f) => f.id === activeFileId) ? (
            <CodeEditor
              theme="codeCafeTheme"
              language={
                editorLanguageMap[
                  openFiles.find((f) => f.id === activeFileId)?.language ||
                    "plaintext"
                ]
              }
              showLineNumbers={true}
              code={fileContents[activeFileId] ?? "// Loading..."}
              onCodeChange={handleCodeChange}
              onEditorDidMount={handleEditorDidMount}
              users={currentRemoteUsers}
              localUserId={localUserId}
              isSessionActive={isSessionActive}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-stone-500">
              Select a file to start editing.
            </div>
          )}
        </div>

        {/* Terminal Resizer */}
        <div
          className={`w-full bg-stone-700 flex-shrink-0 ${
            isTerminalCollapsed
              ? "cursor-pointer hover:bg-stone-500"
              : "cursor-row-resize hover:bg-stone-600 active:bg-stone-500"
          }`}
          style={{ height: `${TERMINAL_HANDLE_HEIGHT}px` }}
          onMouseDown={handleTerminalPanelMouseDown}
        />

        {/* Terminal Panel */}
        <div
          className={`bg-neutral-900 bg-opacity-90 flex flex-col border-t border-stone-600 flex-shrink-0 ${
            isTerminalCollapsed ? "hidden" : "flex"
          }`}
          style={{ height: `${terminalPanelHeight}px` }}
        >
          <div className="flex bg-stone-800 py-1 text-sm flex-shrink-0">
            <div className="px-4 py-1 text-stone-400 text-xs">TERMINAL</div>
          </div>
          <div className="flex-1 px-4 pt-2 font-mono text-sm overflow-hidden min-h-0">
            <TerminalComponent ref={terminalRef} height={terminalPanelHeight} />
          </div>
        </div>
      </div>

      {/* Invisible WebView Resizer Handle */}
      {webViewPanelWidth > 0 && (
        <div
          className="absolute top-0 h-full cursor-col-resize bg-transparent z-20"
          style={{
            width: `${WEBVIEW_HANDLE_GRAB_WIDTH}px`,
            left: `calc(100% - ${webViewPanelWidth}px - ${
              WEBVIEW_HANDLE_GRAB_WIDTH / 2
            }px)`,
          }}
          onMouseDown={handleWebViewPanelMouseDown}
        />
      )}

      {/* WebView Panel */}
      {webViewPanelWidth > 0 && (
        <div
          className="flex-shrink-0 border-l border-stone-600 overflow-hidden"
          style={{ width: `${webViewPanelWidth}px` }}
        >
          <WebViewPanel
            htmlContent={htmlFileContent}
            cssContent={cssFileContent}
            jsContent={jsFileContent}
            onClose={toggleWebView}
          />
        </div>
      )}
    </div>
  );
};

export default MainEditorArea;