export type NavigationItem = {
  href: string;
  label: string;
};

export type NavLinkProps = {
  href: string;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
};

export type ActionButtonProps = NavLinkProps & {
  isPrimary?: boolean;
};
