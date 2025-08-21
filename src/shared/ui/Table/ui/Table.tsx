import { Mods, classNames } from 'shared/lib/classNames';
import cls from './Table.module.sass';
import { Pagination } from 'shared/ui/Pagination';

type TableTheme = 'default' | 'interlaced-fill';
const themeClasses: Record<TableTheme, string> = {
  default: '',
  "interlaced-fill": cls.interlacedFill
};

interface TableCell {
  content: string;
}

interface TableRow {
  cells: TableCell[];
}

export interface TableProps {
  className?: string;
  rows?: TableRow[];
  theme?: TableTheme;
}

export const Table = ({ className, rows, theme = 'default' }: TableProps) => {
  const mods: Mods = {
    [themeClasses[theme]]: true,
  }
  return (
    <div className={classNames(cls.tableContainer, mods, [className])}>
      <div className={cls.tableHeader}>
        Team members
      </div>
      <table className={cls.table}>
        <thead className={cls.tableHead}>
          <tr>
            <th scope="col">Number</th>
            <th scope="col">First name</th>
            <th scope="col">Was born</th>
            <th scope="col">Balance</th>
          </tr>
        </thead>
        <tbody className={cls.tbody}>
          {rows?.map(row =>
            <tr className={cls.row}>
              {row.cells.map(cell =>
                <th className={cls.cell}>{cell.content}</th>
              )}
            </tr>
          )}
        </tbody>
      </table>
      <div className={cls.tableFooter}>
        <Pagination theme='minimal' />
      </div>
    </div>
  );
};