'use client';

import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
import Entity from '@ant-design/cssinjs/lib/Cache';
import { useServerInsertedHTML } from 'next/navigation';
import { useMemo, useRef } from 'react';

export default function StyleComponentsRegistry({
	children,
}: React.PropsWithChildren) {
	const cache = useMemo<Entity>(() => createCache(), []);

	const isServerInserted = useRef(false);

	useServerInsertedHTML(() => {
		if (isServerInserted.current) {
			// We would like to avoid duplicated css insertion
			// But it seems to break the style when streaming
			// return;
		}
		isServerInserted.current = true;
		const attributes = htmlToAttributes(extractStyle(cache));
		return <style {...attributes} />;
	});

	return (
		<StyleProvider cache={cache} hashPriority="high">
			{children}
		</StyleProvider>
	);
}

const startTagRegex = /^<(.+?)>/;

function htmlToAttributes(html: string) {
	const rootTagContentMatch = startTagRegex.exec(html);

	if (!rootTagContentMatch) {
		throw new Error('htmlEjectAttributes: invalid html');
	}
	const [fullMatch, content] = rootTagContentMatch;
	const htmlAttrsRegex = /\s(\w+)="(.+?)"/g;

	let match;
	const argPairs = [];
	while ((match = htmlAttrsRegex.exec(content))) {
		argPairs.push([match[1], match[2]]);
	}
	const [rootTag] = content.split(' ');

	const __html = html.slice(
		fullMatch.length,
		html.lastIndexOf(`</${rootTag}>`)
	);
	return argPairs.reduce((acc, [name, value]) => ({ ...acc, [name]: value }), {
		dangerouslySetInnerHTML: { __html },
	});
}
