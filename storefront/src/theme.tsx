"use client";

import React from "react";
import { ConfigProvider, ThemeConfig } from "antd";

const theme: ThemeConfig = {
	token: {
		fontSize: 14,
		colorPrimary: "#000",
	},
	components: {
		Input: {
			colorPrimary: "#000",
		},
	},
};

export default theme;
