# Riemann ζ 函數計算器

可計算 Riemann zeta 函數、搜尋非平凡零點，並驗證常見特殊值。

## 功能

- **計算 ζ(s)**：輸入複數 `s = a + bi`，回傳 ζ(s) 與 |ζ(s)|
- **非平凡零點**：在臨界線 `Re(s)=1/2` 上，用 Riemann–Siegel Z 函數找前 N 個零點
- **臨界線螺旋圖**：在複平面上繪製 ζ(1/2+it) 的軌跡，零點即曲線過原點
- **相位角視圖**：單位圓上的 arg ζ 旋轉軌跡，以及 φ(t) 與 Riemann–Siegel θ(t) 對照
- **相位→頻率**：ω = dφ/dt 瞬時角頻率，以及素數本征頻率 ω_p = log p
- **特殊值**：快速查看 ζ(2)、ζ(0)、ζ(-1) 等已知結果

## 使用方式

在專案根目錄執行：

```bash
npm run dev
```

瀏覽器開啟：

```
http://localhost:5173/tools/zeta-calculator/
```

## 演算法

1. `Re(s) > 1`：Dirichlet 級數
2. `0 ≤ Re(s) ≤ 1`：Dirichlet η 級數
3. `Re(s) < 0`：函數方程 ζ(s) = χ(s) ζ(1−s)
4. 零點搜尋：Riemann–Siegel Z(t) + 區間二分法

## CLI

```bash
node tools/zeta-calculator/cli.mjs 2
node tools/zeta-calculator/cli.mjs --steps -1
node tools/zeta-calculator/cli.mjs --zeros 5
```

## 圖片

生成 SVG 圖表到 `tools/zeta-calculator/images/`：

```bash
npm run zeta:images
```

網頁版「圖表」分頁也可預覽並下載 PNG。
