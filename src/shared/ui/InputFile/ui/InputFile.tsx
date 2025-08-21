import { Mods, classNames } from 'shared/lib/classNames';
import cls from './InputFile.module.sass';
import { ReactComponent as UploadIcon } from 'assets/icons/upload-cloud-02.svg';
import { DragEvent, useState } from 'react';

export interface InputFileProps {
  className?: string;
  disabled?: boolean;
}

export const InputFile = ({ className, disabled }: InputFileProps) => {

  const [drag, setDrag] = useState(false);
  const mods: Mods = {
    [cls.disabled]: disabled,
    [cls.dragOver]: drag
  }


  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    // e.stopPropagation();
    e.preventDefault();
    setDrag(true);
  }
  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    // e.stopPropagation();
    // e.preventDefault();
    setDrag(false);
  }
  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    // e.stopPropagation();
    e.preventDefault();
    setDrag(false);
  }

  return (
    <div className={classNames(cls.inputFile, mods, [className])} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
      <input
        type="file"
        multiple
        name="file"
        id="fileInput"
        className={cls.input}
        // @change="onChange"
        // ref="file"
        accept=".pdf,.jpg,.jpeg,.png"
      />
      <div className={cls.iconContainer}>
        <UploadIcon className={cls.icon} />
      </div>
      <div className={cls.text}>
        <span className={cls.colorText}>
          Click to upload
        </span> or drag and drop
      </div>
      <div className={cls.text}>SVG, PNG, JPG or GIF (max. 800x400px)</div>
    </div>
  );
};