# Components Documentation

## Overview

AdminFront provides **30+ reusable UI components** built as wrappers around Ant Design components. These components provide a consistent API, custom styling with Tailwind CSS, and full TypeScript support.

## Component Architecture

### Design Principles

1. **Wrapper Pattern**: Extend Ant Design components with custom defaults
2. **Type Safety**: Full TypeScript support with extended prop types
3. **Consistent Styling**: Unified design using Tailwind CSS utilities
4. **Flexibility**: Accept all original Ant Design props via spread operator
5. **Custom Utilities**: Use `cn()` utility for conditional class merging

### Component Template

```typescript
import { Component as AntdComponent, ComponentProps } from 'antd';
import { cn } from '@/lib/utils';

interface Props extends ComponentProps {
  className?: string;
  // Additional custom props
}

export default function Component({ className, ...props }: Props) {
  return (
    <AntdComponent 
      className={cn('default-classes', className)} 
      {...props}
    />
  );
}
```

---

## Layout Components

### App

**Location**: `src/components/App/index.tsx`

**Purpose**: Root application wrapper component

**Usage**:
```typescript
import App from '@/components/App';

<App>
  {children}
</App>
```

---

### Avatar

**Location**: `src/components/Avatar/`

Components:
- `Avatar.tsx`: User avatar display
- `AvatarName.tsx`: Avatar with name label

**Props** (Avatar):
```typescript
interface Props extends AvatarProps {
  className?: string;
}
```

**Usage**:
```typescript
import { Avatar } from '@/components/Avatar';

// Simple avatar
<Avatar src="/user.jpg" />

// With fallback text
<Avatar>JD</Avatar>

// Different sizes
<Avatar size={64} />
<Avatar size="large" />
```

---

### Breadcrumb

**Location**: `src/components/Breadcrumb/Breadcrumb.tsx`

**Purpose**: Navigation breadcrumb trail

**Props**:
```typescript
interface Props extends BreadcrumbProps {
  className?: string;
}
```

**Usage**:
```typescript
import Breadcrumb from '@/components/Breadcrumb';

<Breadcrumb
  items={[
    { title: 'Home', href: '/' },
    { title: 'Products', href: '/products' },
    { title: 'Details' }
  ]}
/>
```

---

### Card

**Location**: `src/components/Card/Card.tsx`

**Purpose**: Container component with shadow and padding

**Props**:
```typescript
interface Props extends CardProps {
  className?: string;
  children?: ReactNode;
  rounded?: boolean;
}
```

**Features**:
- Shadow by default
- Custom padding (p-4)
- Optional rounded corners
- Responsive on mobile

**Usage**:
```typescript
import Card from '@/components/Card';

<Card title="Card Title">
  <p>Card content goes here</p>
</Card>

// With rounded corners
<Card rounded>
  Content
</Card>

// With extra actions
<Card 
  title="Title"
  extra={<Button>Action</Button>}
>
  Content
</Card>
```

---

### Flex

**Location**: `src/components/Flex/Flex.tsx`

**Purpose**: Flexbox layout utility component

**Props**:
```typescript
interface Props extends FlexProps {
  className?: string;
}
```

**Usage**:
```typescript
import Flex from '@/components/Flex';

// Horizontal layout
<Flex gap={16} align="center">
  <span>Item 1</span>
  <span>Item 2</span>
</Flex>

// Vertical layout
<Flex vertical gap={8}>
  <div>Item 1</div>
  <div>Item 2</div>
</Flex>

// Justify content
<Flex justify="space-between">
  <div>Left</div>
  <div>Right</div>
</Flex>
```

---

## Form Components

### Input

**Location**: `src/components/Input/Input.tsx`

**Purpose**: Text input field with clear button

**Props**:
```typescript
interface Props extends AntdInputProps {
  className?: string;
  error?: string;
}
```

**Features**:
- Auto clear button (`allowClear`)
- Custom padding
- Error state support

**Usage**:
```typescript
import Input from '@/components/Input';

<Input 
  placeholder="Enter text"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>

// With error
<Input 
  error="This field is required"
  status="error"
/>
```

---

### InputNumber

**Location**: `src/components/Input/InputNumber.tsx`

**Purpose**: Numeric input with controls

**Usage**:
```typescript
import { InputNumber } from '@/components/Input';

<InputNumber
  min={0}
  max={100}
  value={value}
  onChange={setValue}
/>

// With formatter
<InputNumber
  formatter={value => `$ ${value}`}
  parser={value => value.replace('$ ', '')}
/>
```

---

### InputPassword

**Location**: `src/components/Input/InputPassword.tsx`

**Purpose**: Password input with visibility toggle

**Usage**:
```typescript
import { InputPassword } from '@/components/Input';

<InputPassword
  placeholder="Enter password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>
```

---

### InputWithLabel

**Location**: `src/components/Input/InputWithLabel.tsx`

**Purpose**: Input with associated label

**Props**:
```typescript
interface Props extends InputProps {
  label: string;
  required?: boolean;
}
```

**Usage**:
```typescript
import { InputWithLabel } from '@/components/Input';

<InputWithLabel
  label="Email"
  required
  placeholder="email@example.com"
/>
```

---

### TextArea

**Location**: `src/components/Input/TextArea.tsx`

**Purpose**: Multi-line text input

**Usage**:
```typescript
import { TextArea } from '@/components/Input';

<TextArea
  rows={4}
  placeholder="Enter description"
  maxLength={500}
  showCount
/>
```

---

### DatePicker

**Location**: `src/components/Input/DatePicker.tsx`

**Purpose**: Date and time selection

**Usage**:
```typescript
import { DatePicker } from '@/components/Input';
import dayjs from 'dayjs';

// Single date
<DatePicker 
  value={date}
  onChange={setDate}
/>

// Date range
<DatePicker.RangePicker
  value={[startDate, endDate]}
  onChange={([start, end]) => {
    setStartDate(start);
    setEndDate(end);
  }}
/>
```

---

### Select

**Location**: `src/components/Select/Select.tsx`

**Purpose**: Dropdown selection component

**Props**:
```typescript
interface Props extends AntdSelectProps {
  className?: string;
}
```

**Features**:
- Large size by default
- Custom padding
- Supports all Ant Design Select features

**Usage**:
```typescript
import Select from '@/components/Select';

<Select
  placeholder="Select option"
  options={[
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
  ]}
  value={selected}
  onChange={setSelected}
/>

// Multiple selection
<Select
  mode="multiple"
  options={options}
  value={selectedItems}
  onChange={setSelectedItems}
/>

// With search
<Select
  showSearch
  filterOption={(input, option) =>
    option.label.toLowerCase().includes(input.toLowerCase())
  }
  options={options}
/>
```

---

### TreeSelect

**Location**: `src/components/Select/TreeSelect.tsx`

**Purpose**: Hierarchical tree selection

**Usage**:
```typescript
import { TreeSelect } from '@/components/Select';

<TreeSelect
  treeData={[
    {
      value: 'parent',
      title: 'Parent',
      children: [
        { value: 'child1', title: 'Child 1' },
        { value: 'child2', title: 'Child 2' },
      ],
    },
  ]}
  value={value}
  onChange={setValue}
/>
```

---

### Checkbox

**Location**: `src/components/Checkbox/`

Components:
- `Checkbox.tsx`: Single checkbox
- `CheckboxGroup.tsx`: Multiple checkboxes

**Usage**:
```typescript
import { Checkbox, CheckboxGroup } from '@/components/Checkbox';

// Single checkbox
<Checkbox 
  checked={checked}
  onChange={(e) => setChecked(e.target.checked)}
>
  Accept terms
</Checkbox>

// Checkbox group
<CheckboxGroup
  options={[
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' },
  ]}
  value={selectedValues}
  onChange={setSelectedValues}
/>
```

---

### Radio

**Location**: `src/components/Radio/`

Components:
- `Radio.tsx`: Single radio button
- `RadioGroup.tsx`: Radio button group

**Usage**:
```typescript
import { Radio, RadioGroup } from '@/components/Radio';

<RadioGroup 
  value={value} 
  onChange={(e) => setValue(e.target.value)}
>
  <Radio value="1">Option 1</Radio>
  <Radio value="2">Option 2</Radio>
  <Radio value="3">Option 3</Radio>
</RadioGroup>

// Button style
<RadioGroup 
  value={value}
  onChange={(e) => setValue(e.target.value)}
  optionType="button"
  buttonStyle="solid"
  options={[
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ]}
/>
```

---

### Switch

**Location**: `src/components/Switch/Switch.tsx`

**Purpose**: Toggle switch component

**Usage**:
```typescript
import Switch from '@/components/Switch';

<Switch 
  checked={enabled}
  onChange={setEnabled}
/>

// With labels
<Switch
  checked={enabled}
  onChange={setEnabled}
  checkedChildren="ON"
  unCheckedChildren="OFF"
/>
```

---

### Upload

**Location**: `src/components/Upload/Upload.tsx`

**Purpose**: File upload with drag-and-drop

**Props**:
```typescript
interface Props {
  onFileChosen: (files: File[]) => void;
  filetypes: string[];
  errorMessage?: string;
  placeholder?: React.ReactElement | string;
  className?: string;
  multiple?: boolean;
  text?: React.ReactElement | string;
}
```

**Features**:
- Drag and drop support
- File type validation
- Multiple file support
- Custom error messages
- Upload icon from lucide-react

**Usage**:
```typescript
import Upload from '@/components/Upload';

<Upload
  onFileChosen={(files) => {
    console.log('Files selected:', files);
  }}
  filetypes={['image/jpeg', 'image/png']}
  multiple
  placeholder="JPG, PNG up to 10MB"
/>
```

---

### UploadTemplate

**Location**: `src/components/Upload/UploadTemplate.tsx`

**Purpose**: Ant Design Upload component wrapper

**Usage**:
```typescript
import { UploadTemplate } from '@/components/Upload';

<UploadTemplate
  listType="picture-card"
  fileList={fileList}
  onChange={handleChange}
  onPreview={handlePreview}
>
  <div>
    <PlusOutlined />
    <div>Upload</div>
  </div>
</UploadTemplate>
```

---

## Display Components

### Badge

**Location**: `src/components/Badge/index.tsx`

**Purpose**: Small status indicator

**Props**:
```typescript
interface Props extends BadgeProps {
  className?: string;
  icon?: React.ReactNode;
}
```

**Usage**:
```typescript
import Badge from '@/components/Badge';

// Count badge
<Badge count={5}>
  <Avatar />
</Badge>

// Dot badge
<Badge dot>
  <BellIcon />
</Badge>

// Status badge
<Badge status="success" text="Active" />
<Badge status="error" text="Error" />
<Badge status="warning" text="Warning" />
```

---

### Tag

**Location**: `src/components/Tag/Tag.tsx`

**Purpose**: Labeled categorization

**Usage**:
```typescript
import Tag from '@/components/Tag';

<Tag>Default</Tag>
<Tag color="blue">Blue</Tag>
<Tag color="green">Success</Tag>
<Tag color="red">Error</Tag>

// Closeable tags
<Tag closable onClose={handleClose}>
  Removable
</Tag>
```

---

### Typography

**Location**: `src/components/Typography/`

Components:
- `Title.tsx`: Heading component
- `Text.tsx`: Text component
- `Paragraph.tsx`: Paragraph component
- `ErrorText.tsx`: Error text component

**Title Props**:
```typescript
interface Props {
  className?: string;
  children?: ReactNode;
  level?: 1 | 2 | 3 | 4 | 5;
}
```

**Usage**:
```typescript
import { Title, Text, Paragraph, ErrorText } from '@/components/Typography';

// Headings
<Title level={1}>Main Title</Title>
<Title level={2}>Subtitle</Title>

// Text variations
<Text>Normal text</Text>
<Text type="secondary">Secondary text</Text>
<Text type="success">Success text</Text>
<Text type="warning">Warning text</Text>
<Text type="danger">Danger text</Text>
<Text strong>Bold text</Text>
<Text italic>Italic text</Text>
<Text underline>Underlined text</Text>

// Paragraph
<Paragraph>
  This is a paragraph with multiple lines of text.
</Paragraph>

// Error text
<ErrorText>This field is required</ErrorText>
```

---

### Tooltip

**Location**: `src/components/Tooltip/`

Components:
- `Tooltip.tsx`: Hover tooltip
- `TooltipIcon.tsx`: Icon with tooltip

**Usage**:
```typescript
import { Tooltip, TooltipIcon } from '@/components/Tooltip';

// Simple tooltip
<Tooltip title="Helpful information">
  <span>Hover me</span>
</Tooltip>

// With icon
<TooltipIcon title="More information" />

// Placement
<Tooltip title="Top tooltip" placement="top">
  <Button>Top</Button>
</Tooltip>
```

---

### Image

**Location**: `src/components/Image/`

Components:
- `Image.tsx`: Single image display
- `ImageGroup.tsx`: Multiple images with preview

**Usage**:
```typescript
import { Image, ImageGroup } from '@/components/Image';

// Single image
<Image
  src="/image.jpg"
  alt="Description"
  width={200}
  height={200}
/>

// Image group with preview
<ImageGroup
  images={[
    { src: '/img1.jpg', alt: 'Image 1' },
    { src: '/img2.jpg', alt: 'Image 2' },
  ]}
/>
```

---

### Empty

**Location**: `src/components/Empty/Empty.tsx`

**Purpose**: Empty state placeholder

**Usage**:
```typescript
import Empty from '@/components/Empty';

<Empty description="No data available" />

// Custom image
<Empty
  image={Empty.PRESENTED_IMAGE_SIMPLE}
  description="No results found"
/>
```

---

### Skeleton

**Location**: `src/components/Skeleton/Skeleton.tsx`

**Purpose**: Loading placeholder

**Usage**:
```typescript
import Skeleton from '@/components/Skeleton';

// Default skeleton
<Skeleton />

// Active animation
<Skeleton active />

// Avatar with content
<Skeleton avatar paragraph={{ rows: 4 }} />

// Custom shape
<Skeleton.Button active />
<Skeleton.Input active />
<Skeleton.Image />
```

---

## Interaction Components

### Button

**Location**: `src/components/Button/`

Components:
- `Button.tsx`: Standard button
- `BadgeButton.tsx`: Button with badge
- `FloatButton.tsx`: Floating action button

**Button Props**:
```typescript
interface Props extends AntdButtonProps {
  className?: string;
  icons?: React.ReactNode;
}
```

**Features**:
- Default height: 32px (h-8)
- Font size: 14px
- Large size by default
- Icon support

**Usage**:
```typescript
import { Button, BadgeButton, FloatButton } from '@/components/Button';

// Standard button
<Button type="primary">Primary</Button>
<Button type="default">Default</Button>
<Button type="dashed">Dashed</Button>
<Button type="text">Text</Button>
<Button type="link">Link</Button>

// With icon
<Button icons={<PlusIcon />}>Add Item</Button>

// Loading state
<Button loading>Loading</Button>

// Disabled
<Button disabled>Disabled</Button>

// Danger
<Button danger>Delete</Button>

// Badge button
<BadgeButton count={5}>
  Notifications
</BadgeButton>

// Float button
<FloatButton 
  icon={<PlusIcon />}
  onClick={handleAdd}
/>
```

---

### Modal

**Location**: `src/components/Modal/`

Components:
- `Modal.tsx`: Standard modal dialog
- `SubmitModal.tsx`: Modal with form submission

**Modal Props**:
```typescript
interface Props extends ModalProps {
  className?: string;
  children?: ReactNode;
  handleCancel: () => void;
  handleOk: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  footer?: React.ReactNode;
  id?: string;
}
```

**Features**:
- Auto-managed footer with Cancel/Confirm buttons
- Loading state support
- Max height with scroll
- Custom footer support

**Usage**:
```typescript
import { Modal, SubmitModal } from '@/components/Modal';

const [open, setOpen] = useState(false);

<Modal
  title="Modal Title"
  open={open}
  handleOk={() => {
    // Handle save
    setOpen(false);
  }}
  handleCancel={() => setOpen(false)}
  isLoading={isLoading}
>
  <p>Modal content</p>
</Modal>

// Custom footer
<Modal
  title="Custom Footer"
  open={open}
  handleOk={() => {}}
  handleCancel={() => setOpen(false)}
  footer={[
    <Button key="custom" onClick={handleCustomAction}>
      Custom Action
    </Button>
  ]}
>
  Content
</Modal>
```

---

### Dropdown

**Location**: `src/components/Dropdown/`

Components:
- `Dropdown.tsx`: Dropdown menu
- `ActionAbles.tsx`: Action menu items

**Props**:
```typescript
export type Props = Partial<DropDownProps> & {
  className?: string;
};
```

**Usage**:
```typescript
import { Dropdown } from '@/components/Dropdown';

const items = [
  { key: '1', label: 'Edit', onClick: handleEdit },
  { key: '2', label: 'Delete', onClick: handleDelete, danger: true },
];

<Dropdown menu={{ items }}>
  <Button>
    Actions <DownOutlined />
  </Button>
</Dropdown>
```

---

### Popconfirm

**Location**: `src/components/Popconfirm/Popconfirm.tsx`

**Purpose**: Confirmation popup

**Usage**:
```typescript
import Popconfirm from '@/components/Popconfirm';

<Popconfirm
  title="Delete item?"
  description="This action cannot be undone"
  onConfirm={handleDelete}
  onCancel={() => console.log('Cancelled')}
  okText="Yes"
  cancelText="No"
>
  <Button danger>Delete</Button>
</Popconfirm>
```

---

## Data Components

### Table

**Location**: `src/components/Table/`

Components:
- `Table.tsx`: Standard data table
- `selectable-table.tsx`: Table with row selection

**Props**:
```typescript
interface Props extends TableProps {
  className?: string;
  children?: ReactNode;
}
```

**Features**:
- Full width by default
- Sorting support
- Filtering support
- Pagination integration
- Row selection
- Expandable rows
- Fixed columns

**Usage**:
```typescript
import Table from '@/components/Table';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    sorter: (a, b) => a.age - b.age,
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Button onClick={() => handleEdit(record)}>Edit</Button>
    ),
  },
];

<Table
  columns={columns}
  dataSource={data}
  rowKey="id"
  pagination={{
    current: page,
    pageSize: 10,
    total: total,
    onChange: setPage,
  }}
/>

// With row selection
<Table
  rowSelection={{
    selectedRowKeys: selectedKeys,
    onChange: setSelectedKeys,
  }}
  columns={columns}
  dataSource={data}
/>
```

---

### List

**Location**: `src/components/List/index.tsx`

**Purpose**: Versatile list display

**Usage**:
```typescript
import List from '@/components/List';

<List
  dataSource={items}
  renderItem={(item) => (
    <List.Item>
      <List.Item.Meta
        avatar={<Avatar src={item.avatar} />}
        title={item.title}
        description={item.description}
      />
    </List.Item>
  )}
/>
```

---

### Pagination

**Location**: `src/components/Pagination/Pagination.tsx`

**Purpose**: Page navigation

**Props**:
```typescript
interface Props extends PaginationProps {
  className?: string;
}
```

**Usage**:
```typescript
import Pagination from '@/components/Pagination';

<Pagination
  current={currentPage}
  total={totalItems}
  pageSize={pageSize}
  onChange={handlePageChange}
  showSizeChanger
  showTotal={(total) => `Total ${total} items`}
/>
```

---

### Steps

**Location**: `src/components/Steps/`

Components:
- `Steps.tsx`: Step progress indicator

**Usage**:
```typescript
import Steps from '@/components/Steps';

<Steps
  current={currentStep}
  items={[
    { title: 'Step 1', description: 'Description' },
    { title: 'Step 2', description: 'Description' },
    { title: 'Step 3', description: 'Description' },
  ]}
/>

// Vertical steps
<Steps
  direction="vertical"
  current={currentStep}
  items={steps}
/>
```

---

### Collapse

**Location**: `src/components/Collapse/Collapse.tsx`

**Purpose**: Expandable panels

**Usage**:
```typescript
import Collapse from '@/components/Collapse';

<Collapse
  items={[
    {
      key: '1',
      label: 'Panel 1',
      children: <p>Content of panel 1</p>,
    },
    {
      key: '2',
      label: 'Panel 2',
      children: <p>Content of panel 2</p>,
    },
  ]}
/>

// Accordion mode (single panel open)
<Collapse accordion items={items} />
```

---

### Tabs

**Location**: `src/components/Tabs/Tabs.tsx`

**Purpose**: Tabbed content panels

**Props**:
```typescript
interface Props extends TabsProps {
  className?: string;
}
```

**Usage**:
```typescript
import Tabs from '@/components/Tabs';

<Tabs
  items={[
    {
      key: '1',
      label: 'Tab 1',
      children: <div>Content 1</div>,
    },
    {
      key: '2',
      label: 'Tab 2',
      children: <div>Content 2</div>,
    },
  ]}
  onChange={handleTabChange}
/>

// Card style
<Tabs type="card" items={items} />
```

---

## Utility Components

### Await

**Location**: `src/components/Await/index.tsx`

**Purpose**: Suspense boundary for async data

**Usage**:
```typescript
import Await from '@/components/Await';

<Await
  promise={fetchData()}
  fallback={<Skeleton />}
>
  {(data) => <DataDisplay data={data} />}
</Await>
```

---

## Component Styling

### cn() Utility Function

All components use the `cn()` utility from `@/lib/utils` for className merging:

```typescript
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Features**:
- Conditional class names with `clsx`
- Intelligent Tailwind class merging with `tailwind-merge`
- Prevents class conflicts
- Type-safe

**Example**:
```typescript
cn('px-4 py-2', isActive && 'bg-blue-500', className)
// Result: "px-4 py-2 bg-blue-500 custom-class"
```

---

## Best Practices

### Component Usage

1. **Import from index files**:
   ```typescript
   import { Button } from '@/components/Button';
   ```

2. **Use TypeScript props**:
   ```typescript
   const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
     // Component logic
   };
   ```

3. **Extend default props**:
   ```typescript
   <Button className="custom-class" {...antdProps}>
     Click me
   </Button>
   ```

4. **Leverage Ant Design features**:
   All Ant Design props are available through prop spreading

5. **Consistent styling**:
   Use Tailwind classes with `cn()` utility

### Customization

1. **Override styles**:
   ```typescript
   <Button className="h-10 text-lg">
     Larger Button
   </Button>
   ```

2. **Add custom props**:
   Extend the Props interface to add new functionality

3. **Theme customization**:
   Modify `src/theme.tsx` for global changes

---

## Testing Components

### Unit Tests

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '@/components/Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await userEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

---

## Accessibility

All components inherit Ant Design's accessibility features:

- **ARIA attributes**: Proper labels and roles
- **Keyboard navigation**: Tab, Enter, Escape support
- **Screen reader support**: Semantic HTML and ARIA
- **Focus management**: Visible focus indicators
- **Color contrast**: WCAG AA compliant

---

## Performance

### Optimization Techniques

1. **Code splitting**: Components are lazy-loaded when needed
2. **Tree shaking**: Only imported components are bundled
3. **Memoization**: Use `React.memo()` for expensive components
4. **Virtual scrolling**: Table and List support virtualization

---

## Migration from Ant Design

If migrating from direct Ant Design usage:

```typescript
// Before
import { Button } from 'antd';
<Button type="primary">Click</Button>

// After
import Button from '@/components/Button';
<Button type="primary">Click</Button>
```

Benefits:
- Consistent styling across the app
- Custom defaults (size, padding, etc.)
- Easier to maintain and update
- Type-safe custom props

---

## Summary

The component library provides:

- ✅ 30+ production-ready components
- ✅ Full TypeScript support
- ✅ Consistent design system
- ✅ Responsive and accessible
- ✅ Easy to customize
- ✅ Well-tested and documented

For implementation examples, see the `src/modules/` directory where these components are used in real features.

---

**Last Updated**: December 2024

