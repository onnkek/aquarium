import { useSliderThumb } from "@react-aria/slider";
import { useRef } from "react";
import { useFocusRing } from '@react-aria/focus';
import { mergeProps } from '@react-aria/utils';
import { VisuallyHidden } from "@react-aria/visually-hidden";
import cls from './Slider.module.sass';
import { Mods, classNames } from "helpers/classNames";
import { SliderTextType } from "./Slider";

const textClasses: Record<SliderTextType, string> = {
  bottom: cls.bottom,
  'tooltip-top': cls.tooltipTop,
  none: cls.none
};

export interface ThumbProps {
  state?: any;
  trackRef?: any;
  index?: number;
  text: SliderTextType;
};

export const Thumb = (props: ThumbProps) => {
  const { state, trackRef, index, text } = props;
  const inputRef = useRef(null);
  const { thumbProps, inputProps } = useSliderThumb(
    {
      index,
      trackRef,
      inputRef
    },
    state
  );
  const mods: Mods = {
    [textClasses[text]]: true
  }
  const { focusProps, isFocusVisible } = useFocusRing();
  return (
    <div className={cls.thumbContainer}
      style={{ left: `${state.getThumbPercent(index) * 100}%` }}>
      <div
        {...thumbProps}
        className={cls.thumb}
        style={{
          boxShadow: isFocusVisible
            ? '0px 2px 4px -2px #1018280F, 0px 4px 8px -2px #1018281A, 0px 0px 0px 4px #9E77ED3D'
            : '0px 2px 4px -2px #1018280F, 0px 4px 8px -2px #1018281A'
        }}
      >

        <VisuallyHidden>
          <input
            ref={inputRef}
            {...mergeProps(inputProps, focusProps)}
          />
        </VisuallyHidden>
      </div>
      <output className={classNames(cls.output, mods)}>{`${state.getThumbValue(index)}%`}</output>
    </div>
  );
}