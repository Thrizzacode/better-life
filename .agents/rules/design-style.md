---
trigger: model_decision
description: 在進行 UI 元件開發與畫面切版時
---

在進行 UI 元件開發與畫面切版時，為了確保專案樣式的高度可維護性與一致性，請嚴格遵守以下樣式撰寫規範：

## 1. 核心原則：Tailwind CSS First

所有的 CSS 樣式設計**一律優先使用 Tailwind CSS**。
開發者應盡可能利用 Tailwind 提供的 Utility Classes 來完成排版（Layout）、間距（Spacing）、顏色（Colors）、字體（Typography）以及響應式設計（RWD）。

## 2. 例外降級原則：CSS Modules

只有在 Tailwind CSS **完全無法處理**，或實作會導致程式碼極度難以閱讀時，才允許作為例外，降級使用 **CSS Modules (`.module.css`)**。

## 3. 具體實作指南

### 3.1 必須使用 Tailwind 的情境

- **日常 UI 開發**：絕大多數的畫面切版與元件開發。
- **狀態樣式切換**：例如 `hover:`、`focus:`、`active:`、`disabled:` 等。
- **響應式斷點設計**：例如 `sm:`、`md:`、`lg:`、`xl:`。
- **任意值語法（Arbitrary values）**：即使遇到非標準設計稿的特殊數值，也應優先使用 Tailwind 的任意值語法（例如 `w-[327px]`、`text-[#1a2b3c]`），而非立刻改用 CSS Modules。

### 3.2 允許使用 CSS Modules 的情境（需在 Pull Request 中備註原因）

- **複雜的自定義動畫（Keyframes）**：當 Tailwind 內建的 `animate-` 無法滿足，且該動畫不需要被全域共用時。
- **複雜的偽元素組合**：當 `before:` 或 `after:` 的樣式過於複雜，導致 HTML 標籤內的 class 屬性過長且難以維護時。
- **覆寫第三方套件樣式**：需要深度覆寫無 Headless 支援的第三方 UI 元件庫樣式時。
- **特定動態變數**：樣式極度依賴 JavaScript 傳入的複雜動態變數，且無法透過 Inline CSS Variables 與 Tailwind 結合處理時。

## 4. 嚴格禁止事項

- ❌ **嚴禁使用傳統的全域 CSS（Global CSS）**來定義個別元件的樣式，以避免樣式污染。
- ❌ **嚴禁使用 Inline Styles（`style={{ ... }}`）**，除非是為了傳遞動態運算的 CSS 變數（CSS Variables）。
