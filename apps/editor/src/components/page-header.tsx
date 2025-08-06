import React from 'react';
import { ButtonBase } from '@mlw-packages/react-components';
import { ArrowLeftIcon } from '@phosphor-icons/react';

export type PageHeaderProps = {
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  onBack?: () => void;
  extra?: React.ReactNode;
  fullPage?: boolean;
  ghost?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
};

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subTitle, extra, onBack, children, style }) => {
  return (
    <div className="px-6 py-4 space-y-4" style={style}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <ButtonBase variant="ghost" onClick={onBack} className="p-2">
              <ArrowLeftIcon />
            </ButtonBase>
          )}
          <div className="flex items-center gap-2">
            {title}
            {subTitle && <span className="text-sm">{subTitle}</span>}
          </div>
        </div>
        {extra && <div className="flex items-center gap-3">{extra}</div>}
      </div>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};
