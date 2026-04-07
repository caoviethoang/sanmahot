import { cva, type VariantProps } from 'class-variance-authority';
const buttonVariants = cva('base', { variants: { size: { lg: 'lg' } } });
type Props = VariantProps<typeof buttonVariants>;
const p: Props = { size: 'lg' };
