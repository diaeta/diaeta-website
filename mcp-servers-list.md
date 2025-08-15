# MCP Servers Available in Workspace

## Core File System & Development Tools

### 1. **Filesystem MCP Server**
- **Description**: File system operations for reading, writing, and managing files
- **Key Functions**:
  - `mcp_Filesystem_read_text_file` - Read text files with encoding support
  - `mcp_Filesystem_read_media_file` - Read image/audio files as base64
  - `mcp_Filesystem_write_file` - Create or overwrite files
  - `mcp_Filesystem_edit_file` - Make line-based edits to files
  - `mcp_Filesystem_create_directory` - Create directories
  - `mcp_Filesystem_list_directory` - List directory contents
  - `mcp_Filesystem_move_file` - Move/rename files
  - `mcp_Filesystem_search_files` - Search for files by pattern
  - `mcp_Filesystem_get_file_info` - Get file metadata

### 2. **Codebase Search & Navigation**
- **Description**: Tools for searching and navigating codebases
- **Key Functions**:
  - `codebase_search` - Semantic search across codebase
  - `file_search` - Fuzzy file path search
  - `grep_search` - Regex pattern search
  - `read_file` - Read file contents with line ranges
  - `search_replace` - Find and replace text in files

## Image Processing & Generation

### 3. **Image Extractor MCP Server**
- **Description**: Extract and analyze images from various sources
- **Key Functions**:
  - `mcp_ImageExtractor_extract_image_from_file` - Extract from local files
  - `mcp_ImageExtractor_extract_image_from_url` - Extract from web URLs
  - `mcp_ImageExtractor_extract_image_from_base64` - Extract from base64 data
- **Features**: Visual content analysis, OCR, object recognition

### 4. **Image Server MCP Server**
- **Description**: AI-powered image generation using DALL-E
- **Key Functions**:
  - `mcp_ImageServer_generate-image` - Generate custom images
  - `mcp_ImageServer_generate-favicon` - Generate favicon.ico files
- **Features**: Multiple formats (PNG, SVG, ICO), customizable sizes

### 5. **Image Downloader MCP Server**
- **Description**: Download and process images from URLs
- **Key Functions**:
  - `mcp_ImageDownloader_download_image` - Download single image
  - `mcp_ImageDownloader_download_images_batch` - Batch download images
- **Features**: Format conversion, compression, resizing

## Web Development & Testing

### 6. **Playwright Browser MCP Server**
- **Description**: Browser automation and web testing
- **Key Functions**:
  - `mcp_Playwright_browser_navigate` - Navigate to URLs
  - `mcp_Playwright_browser_click` - Click elements
  - `mcp_Playwright_browser_type` - Type text
  - `mcp_Playwright_browser_take_screenshot` - Capture screenshots
  - `mcp_Playwright_browser_evaluate` - Execute JavaScript
  - `mcp_Playwright_browser_snapshot` - Accessibility snapshot
  - `mcp_Playwright_browser_wait_for` - Wait for conditions
  - `mcp_Playwright_browser_tab_*` - Tab management
  - `mcp_Playwright_browser_file_upload` - File uploads
  - `mcp_Playwright_browser_drag` - Drag and drop
  - `mcp_Playwright_browser_hover` - Hover interactions
  - `mcp_Playwright_browser_select_option` - Select dropdown options
  - `mcp_Playwright_browser_press_key` - Keyboard input
  - `mcp_Playwright_browser_handle_dialog` - Handle dialogs
  - `mcp_Playwright_browser_console_messages` - Get console messages
  - `mcp_Playwright_browser_network_requests` - Monitor network
  - `mcp_Playwright_browser_resize` - Resize browser window
  - `mcp_Playwright_browser_close` - Close browser

### 7. **Lighthouse MCP Server**
- **Description**: Web performance and accessibility auditing
- **Key Functions**:
  - `mcp_lighthouse_run_audit` - Run comprehensive audit
  - `mcp_lighthouse_get_performance_score` - Get performance score only
- **Features**: Performance, accessibility, SEO, best practices, PWA audits

### 8. **TestSprite MCP Server**
- **Description**: Automated testing framework for frontend and backend
- **Key Functions**:
  - `mcp_TestSprite_testsprite_bootstrap_tests` - Initialize testing
  - `mcp_TestSprite_testsprite_generate_code_summary` - Analyze codebase
  - `mcp_TestSprite_testsprite_generate_prd` - Generate PRD
  - `mcp_TestSprite_testsprite_generate_frontend_test_plan` - Frontend test plan
  - `mcp_TestSprite_testsprite_generate_backend_test_plan` - Backend test plan
  - `mcp_TestSprite_testsprite_generate_code_and_execute` - Generate and run tests

## UI Component Generation

### 9. **Magic 21st MCP Server**
- **Description**: AI-powered UI component generation and refinement
- **Key Functions**:
  - `mcp_Magic_21st_magic_component_builder` - Generate new UI components
  - `mcp_Magic_21st_magic_component_inspiration` - Get component inspiration
  - `mcp_Magic_21st_magic_component_refiner` - Refine existing components
- **Features**: React components, modern UI patterns, responsive design

### 10. **Magic Logo Search MCP Server**
- **Description**: Search and generate company logos
- **Key Functions**:
  - `mcp_Magic_logo_search` - Search for company logos
- **Features**: Multiple formats (JSX, TSX, SVG), light/dark themes

## Knowledge Management

### 11. **Byterover MCP Server**
- **Description**: Knowledge storage and retrieval system
- **Key Functions**:
  - `mcp_byterover-mcp_byterover-retrieve-knowledge` - Retrieve stored knowledge
  - `mcp_byterover-mcp_byterover-store-knowledge` - Store new knowledge
- **Features**: Context-aware knowledge management, programming patterns

### 12. **Memory Bank MCP Server**
- **Description**: Project memory and documentation management
- **Key Functions**:
  - `mcp_MemoryBank_get-memory-bank-info` - Read memory bank contents
  - `mcp_MemoryBank_update-memory-bank` - Update memory bank files
  - `mcp_MemoryBank_init-memory-bank` - Initialize memory bank
- **Features**: Project context, architecture documentation, decision tracking

## Problem Solving & Analysis

### 13. **Sequential Thinking MCP Server**
- **Description**: Advanced problem-solving through structured thinking
- **Key Functions**:
  - `mcp_SequentialThinking_sequentialthinking` - Dynamic problem-solving
- **Features**: Chain of thought reasoning, hypothesis generation, iterative analysis

## System & Terminal Operations

### 14. **Terminal Command Execution**
- **Description**: Execute terminal commands and scripts
- **Key Functions**:
  - `run_terminal_cmd` - Execute shell commands
- **Features**: Background execution, command validation

### 15. **File Management Operations**
- **Description**: Basic file operations
- **Key Functions**:
  - `delete_file` - Delete files
  - `list_dir` - List directory contents
- **Features**: File system navigation and cleanup

## Summary

**Total MCP Servers**: 15 distinct MCP servers

**Categories**:
- **File System & Development**: 2 servers
- **Image Processing**: 3 servers  
- **Web Development & Testing**: 3 servers
- **UI Component Generation**: 2 servers
- **Knowledge Management**: 2 servers
- **Problem Solving**: 1 server
- **System Operations**: 2 servers

**Key Capabilities**:
- ✅ Full-stack development support
- ✅ Image processing and generation
- ✅ Web testing and performance analysis
- ✅ UI component creation and refinement
- ✅ Knowledge management and context awareness
- ✅ Advanced problem-solving capabilities
- ✅ File system operations and management

**Installation Status**: All servers are installed and configured in the workspace

