## 前端样式规范 v1.0
**适用技术栈：Vue3 + UnoCSS + Less/SCSS；移动端 Vue3 + UnoCSS + uni-app**

---

### 一、目标与适用范围

#### 1.1 规范目标
- 统一 PC 与移动端视觉和交互体验  
- 提升协作效率，减少样式冲突和重复代码  
- 提高代码可维护性与可扩展性  
- 建立可执行、可检查、可持续迭代的工程规范  

#### 1.2 适用范围
- PC Web 项目：`Vue3 + UnoCSS + Less/SCSS`  
- 移动端项目：`Vue3 + UnoCSS + uni-app`（H5 / 小程序）  
- 新项目必须遵循本规范，老项目按「增量改造」原则逐步对齐  

---

### 二、样式技术使用策略

#### 2.1 使用优先级
1. **优先 UnoCSS 原子类**：布局、间距、排版、常见视觉样式  
2. **其次 Less/SCSS**：复杂组件结构、状态样式、样式复用封装  
3. **最后全局样式**：仅用于 reset、tokens、主题、公共布局  

#### 2.2 原则说明
- UnoCSS 适合高频、可组合的基础样式  
- Less/SCSS 适合语义化结构样式与复杂场景抽象  
- 禁止同一效果重复实现（原子类和自定义样式双写）  

---

### 三、命名规范

#### 3.1 基本规则
- 类名统一小写英文，使用 `-` 连接  
- 命名必须语义化，禁止 `box1`、`left2`、`aaa` 等无意义命名  

#### 3.2 BEM 规范（推荐）
- Block：`.user-card`  
- Element：`.user-card__avatar`  
- Modifier：`.user-card--compact` / `.user-card__avatar--large`  

#### 3.3 状态类命名
- 统一使用 `is-*`：`.is-active`、`.is-disabled`、`.is-loading`、`.is-error`  

#### 3.4 行为与测试钩子
- 行为类：`.js-*`  
- 测试类：`.qa-*`  
- 钩子类不得承载样式  

---

### 四、目录与文件组织

#### 4.1 推荐目录结构
```text
src/
  styles/
    base/          # reset、全局基础样式
    tokens/        # 设计令牌（颜色、字号、间距等）
    mixins/        # Less/SCSS mixin 与 function
    layout/        # 页面布局相关样式
    components/    # 通用组件样式
    motion/        # 动效与 keyframes
    themes/        # 多主题（可选）
    index.scss     # 样式总入口
```

#### 4.2 SFC 样式约定
- 优先使用：`<style lang="scss" scoped>` 或 `<style lang="less" scoped>`（团队统一一种优先）  
- 组件根 class 与组件名语义一致：`UserCard.vue` -> `.user-card`  
- 禁止在业务组件中写大范围全局样式（确需全局时需注明原因）  

---

### 五、设计令牌（Design Tokens）

#### 5.1 令牌范围
- 颜色：`$color-primary`、`$color-success`、`$color-warning`、`$color-danger`  
- 字号：`$font-size-xs/sm/md/lg`  
- 间距：`$space-4/8/12/16...`（4/8pt 体系）  
- 圆角：`$radius-sm/md/lg/round`  
- 阴影：`$shadow-sm/md/lg`  
- 层级：`$z-index-dropdown/modal/toast`  

#### 5.2 规则
- 禁止 magic number（如 `13px`、`17px` 无语义值）
- 所有视觉核心值优先来自 tokens
- UnoCSS 的 `theme` 与 tokens 语义保持一致（如 `primary`、`success`）

#### 5.3 CSS 变量规范

##### 5.3.1 命名规范
- 采用 `--[category]-[name]` 格式，如 `--color-primary`、`--font-size-md`
- 语义化命名，禁止 `--tmp`、`--var1` 等无意义命名
- 主题相关变量使用 `--color-bg`、`--color-text` 等抽象语义

##### 5.3.2 使用场景
| 场景 | 推荐方式 | 说明 |
|------|---------|------|
| UnoCSS theme 配置 | CSS 变量 | 与 `theme()` 函数配合 |
| 组件内部样式复用 | CSS 变量 | 适合多实例组件 |
| 主题切换（深色模式） | CSS 变量 | 支持运行时切换 |
| 静态样式值 | Less/SCSS 变量 | 编译时确定，无需运行时切换 |

##### 5.3.3 Fallback 策略
- 始终提供合理的默认值：`var(--color-primary, #3b82f6)`
- Fallback 值可嵌套其他变量：`var(--color-text, var(--color-primary))`
- 避免在 fallback 中使用复杂表达式

##### 5.3.4 示例
```scss
// 定义（推荐集中在 tokens 文件）
:root {
  --color-primary: #3b82f6;
  --color-bg: #ffffff;
  --radius-md: 8px;
}

// 使用
.button {
  background-color: var(--color-primary);
  border-radius: var(--radius-md, 8px);
}

// 深色模式覆盖
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #1a1a1a;
  }
}
```

##### 5.3.5 注意事项
- CSS 变量区分大小写，`--Color-primary` 与 `--color-primary` 是不同变量
- CSS 变量会被继承，适合设置全局 root 变量
- UnoCSS 中使用 `theme()` 函数读取 CSS 变量：`theme(--color-primary)`

---

### 六、UnoCSS 使用规范

#### 6.1 推荐场景
- 布局：`flex/grid`、对齐、换行、间距  
- 排版：字号、字重、颜色、行高  
- 视觉：背景、边框、圆角、基础阴影  

#### 6.2 可读性要求
- 单元素原子类建议不超过 8–10 个  
- 超过时建议抽语义类（如 `.btn-primary`）  
- class 顺序建议：**布局 -> 盒模型 -> 排版 -> 视觉 -> 状态**  

#### 6.3 动态类规范
- 避免不可静态分析的字符串拼接类名  
- 需要动态生成时，统一登记到 UnoCSS `safelist`  

---

### 七、Less/SCSS 编码规范

#### 7.1 属性顺序
1. 布局与定位  
2. 盒模型  
3. 排版  
4. 视觉  
5. 动效与其他  

#### 7.2 选择器与嵌套
- 嵌套深度不超过 3 层  
- 禁止 id 选择器作为业务样式主选择器  
- 避免过高选择器权重与链式过深  

#### 7.3 `!important` 约束
- 默认禁止  
- 仅在覆盖三方样式或平台限制时可用，并附注释说明原因  

---

### 八、布局与响应式规范

#### 8.1 布局原则
- 优先 `flex`，复杂二维布局使用 `grid`  
- 谨慎用 `absolute` 完成主布局，仅用于局部定位  

#### 8.2 响应式断点（示例）
- `sm: 640px`  
- `md: 768px`  
- `lg: 1024px`  
- `xl: 1280px`  

统一在 UnoCSS 配置中定义与使用（如 `md:flex`、`lg:hidden`）。

#### 8.3 移动端（uni-app）适配
- 采用统一适配策略，不混用多套方案  
- 优先保证主流 iOS/Android 机型一致性  
- 小程序端样式遵循 uni-app 平台限制与最佳实践  

---

### 九、动效规范（重点）

#### 9.1 动效场景分级
**必须有动效**
- 弹窗/抽屉/遮罩显隐  
- Toast/消息提示出现与消失  
- 关键状态切换（加载、成功、失败）  

**建议有动效**
- Tab 切换、列表筛选、模块内容刷新  

**慎用/禁用**
- 高频操作中的重动效  
- 闪烁、眩晕、长时间循环动画  

#### 9.2 动效参数标准
- `fast`: 120–180ms  
- `normal`: 180–260ms  
- `slow`: 260–350ms  
- 标准 easing：`cubic-bezier(0.4, 0, 0.2, 1)`  

统一沉淀到 `styles/motion/_tokens.scss`。

#### 9.3 动画属性规范
- 推荐动画属性：`opacity`、`transform`、`background-color`、`color`  
- 避免动画属性：`width`、`height`、`top`、`left`、`box-shadow`（高性能风险）  
- 优先 `transition`，复杂序列再用 `@keyframes`  

#### 9.4 动效命名与归档
- `@keyframes` 统一放 `styles/motion/`  
- 命名格式：`motion-[场景]-[类型/方向]`  
  - 如：`motion-modal-in-up`、`motion-toast-fade`  

#### 9.5 无障碍动效支持
必须支持减少动效偏好：

```scss
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

#### 9.6 uni-app 动效约束
- 优先 `transform/opacity`  
- 避免列表滚动中执行复杂动画  
- 低端机优先保证流畅和可用性  

---

### 十、浏览器与平台兼容规范（重点）

#### 10.1 支持矩阵（建议）
- PC：Chrome / Edge / Firefox / Safari 最近两个主版本  
- H5：Android Chrome >= 95，iOS Safari >= 14  
- 小程序/App：按 uni-app 官方支持范围 + 业务需求  
- 明确不支持：IE  

#### 10.2 工程配置
统一配置 `browserslist`：

```text
> 0.5%
last 2 versions
not dead
not ie <= 11
```

必须启用 `Autoprefixer`，禁止大范围手写厂商前缀。

#### 10.3 CSS 特性使用策略
- 可常规使用：Flex、Grid、transform、transition、calc  
- CSS 变量可用，但关键样式建议提供 fallback  
- 新选择器（`:has`/`:is`/`:where`）需评估兼容后再使用  

#### 10.4 降级原则
- 允许视觉降级，不允许核心流程不可用  
- 对高级特性使用 `@supports` 做增强式写法  

示例：

```scss
.card-list {
  display: block;
}

@supports (display: grid) {
  .card-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
  }
}
```

#### 10.5 兼容问题处理流程
- 记录：浏览器版本、系统版本、复现步骤、截图/录屏  
- 在支持矩阵内问题必须修复  
- 修复后沉淀到兼容问题案例库（现象/原因/方案）  

---

### 十一、可访问性（A11y）基础规范

- 正文与背景对比度建议 >= 4.5:1  
- 状态表达不可仅依赖颜色  
- 可交互元素必须有清晰 `:focus-visible`  
- 禁止无替代地移除 outline  
- 保证文字可读性（字号、行高、间距）  

---

### 十二、工程质量门禁

#### 12.1 Lint 与格式化
- Stylelint：检查 Less/SCSS/Vue 样式规范  
- Prettier：统一格式  
- ESLint：配合脚本逻辑与模板规范  

#### 12.2 建议脚本
- `lint:style`: `stylelint "src/**/*.{vue,scss,less}"`  
- `lint`: `eslint src && npm run lint:style`  

#### 12.3 Code Review 检查项
- 是否优先正确使用 UnoCSS  
- 是否遵循 BEM / `is-*` 命名  
- 是否使用 tokens，避免 magic number  
- 动效参数和属性是否符合规范  
- 是否考虑浏览器兼容与降级策略  
- 是否引入不必要的全局污染  

---

### 十三、落地与版本管理

#### 13.1 新项目要求
- 使用统一模板初始化（含 UnoCSS、styles 目录、lint 规则）  
- 未接入规范的项目不允许进入正式开发阶段  

#### 13.2 老项目改造策略
- 以「新增即规范、重构即治理」为原则  
- 大规模改造进入技术债排期统一处理  

#### 13.3 规范版本管理
- 当前版本：`v1.0.0`  
- 每次更新记录：版本号、变更点、生效日期、责任人  

#### 13.4 例外机制
- 特殊场景允许例外，但必须：
  - 代码内注明原因  
  - 在例外记录中登记  
  - 经前端负责人审批  

---

### 附录 A：推荐团队共识（简版）

- 先用 UnoCSS，再考虑 Less/SCSS  
- 少写「临时样式」，多做「可复用抽象」  
- 动效服务反馈，不服务炫技  
- 兼容策略前置，不在上线后补救  
- 规范不是文档，而是日常开发默认行为

