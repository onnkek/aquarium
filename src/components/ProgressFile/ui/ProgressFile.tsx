import { Mods, classNames } from 'helpers/classNames';
import cls from './ProgressFile.module.sass';
import { ReactComponent as FileDefaultIcon } from 'assets/icons/file-04.svg';
import { ReactComponent as RemoveIcon } from 'assets/icons/trash-01.svg';
import { Progress } from 'components/Progress/ui/Progress';
import { Checkbox } from 'components/Checkbox';

type Status = 'pending' | 'fulfilled' | 'rejected';
const statusClasses: Record<Status, string> = {
  pending: cls.pending,
  fulfilled: cls.fulfilled,
  rejected: cls.rejected
};
export interface ProgressFileProps {
  className?: string;
  status?: Status;
  value?: number;
  fileName?: string;
  FileIcon?: React.VFC<React.SVGProps<SVGSVGElement>>;
  fileSize?: string;
}

export const ProgressFile = ({
  className,
  status = 'pending',
  value = 0,
  fileName = 'File name',
  FileIcon = FileDefaultIcon,
  fileSize = 'File size'

}: ProgressFileProps) => {
  const mods: Mods = {
    [statusClasses[status]]: status,
  }
  return (
    <div className={classNames(cls.progressFile, mods, [className])}>
      <FileIcon className={cls.fileIcon} />
      <div className={cls.content}>
        <div className={cls.header}>
          <div className={cls.fileName}>{fileName}</div>
          {status === 'fulfilled' ?
            <Checkbox size='M' checked className={cls.checkbox} />
            :
            <RemoveIcon className={cls.removeIcon} />
          }
        </div>
        <div className={cls.fileSize}>{fileSize}</div>
        {status === 'rejected' ?
          <div className={cls.error}>Try again</div>
          :
          <Progress className={cls.progress} value={status === 'fulfilled' ? 100 : value} />
        }
      </div>
    </div >
  );
};