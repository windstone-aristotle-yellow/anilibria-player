"use client";

import {CheckIcon, ColorSwatch, MantineColor, rem, Tooltip} from "@mantine/core";
import {useContext, useEffect, useState} from "react";
import {CustomThemeContext} from "@/utils/Contexts/Contexts";
import classes from './ColorSchemeControl.module.css';
import {variables} from "@/configs/variables";

export default function ColorSchemeControl() {
    const { theme, setTheme } = useContext(CustomThemeContext);
    const [checkedColor, setCheckedColor] = useState(theme.color);

    function setColor(value: MantineColor) {
        setCheckedColor(value)
        setTheme({ color: value, breadcrumb: theme.breadcrumb })
    }

    useEffect(() => {
        setCheckedColor(theme.color)
    }, [theme]);

    const colorSwatches = variables.mantineColors.map((color) => {
        const mantineColor = color === "black" ? "#000000" : `var(--mantine-color-${color}-6)`

        return (
            <Tooltip
                key={color}
                label={color}
                position="top"
                transitionProps={{ transition: 'pop', duration: 300 }}
            >
                <ColorSwatch
                    component="button"
                    color={mantineColor}
                    onClick={() => setColor(color)}
                    className={classes.colorSwatch}
                    w={rem(32)}
                    h={rem(32)}
                >
                    {
                        checkedColor === color && (
                            <CheckIcon className={classes.checkIcon} />
                        )
                    }
                </ColorSwatch>
            </Tooltip>
        )
    })

    return (
        <>
            {colorSwatches}
        </>
    )
}