const SVG_PROPS = {
	width: '100%',
	height: '100%',
	viewBox: '0 0 240 148',
	preserveAspectRatio: 'xMidYMid slice',
	xmlns: 'http://www.w3.org/2000/svg',
	style: { position: 'absolute' as const, inset: 0, display: 'block' as const },
};

export function AttractionScene() {
	return (
		<svg {...SVG_PROPS}>
			<rect x="0" y="122" width="240" height="26" fill="#D0D0D0" />
			<circle cx="120" cy="76" r="52" fill="none" stroke="#C2C2C2" strokeWidth="6" />
			<line x1="120" y1="24" x2="120" y2="128" stroke="#CACACA" strokeWidth="2.5" />
			<line x1="68" y1="76" x2="172" y2="76" stroke="#CACACA" strokeWidth="2.5" />
			<line x1="83" y1="39" x2="157" y2="113" stroke="#CACACA" strokeWidth="2.5" />
			<line x1="157" y1="39" x2="83" y2="113" stroke="#CACACA" strokeWidth="2.5" />
			<circle cx="120" cy="76" r="9" fill="#BABABA" />
			<circle cx="120" cy="76" r="4" fill="#D4D4D4" />
			<line x1="112" y1="128" x2="78" y2="148" stroke="#BABABA" strokeWidth="5" />
			<line x1="128" y1="128" x2="162" y2="148" stroke="#BABABA" strokeWidth="5" />
			<line x1="88" y1="138" x2="152" y2="138" stroke="#BABABA" strokeWidth="3" />
			<rect x="113" y="16" width="14" height="10" rx="3" fill="#CECECE" />
			<line x1="120" y1="24" x2="120" y2="26" stroke="#C0C0C0" strokeWidth="1.5" />
			<rect x="164" y="68" width="14" height="10" rx="3" fill="#CECECE" />
			<line x1="172" y1="76" x2="172" y2="68" stroke="#C0C0C0" strokeWidth="1.5" />
			<rect x="113" y="118" width="14" height="10" rx="3" fill="#CECECE" />
			<rect x="62" y="68" width="14" height="10" rx="3" fill="#CECECE" />
			<line x1="24" y1="16" x2="24" y2="28" stroke="#C8C8C8" strokeWidth="2" />
			<line x1="18" y1="22" x2="30" y2="22" stroke="#C8C8C8" strokeWidth="2" />
			<line x1="19" y1="17" x2="29" y2="27" stroke="#C8C8C8" strokeWidth="1.5" />
			<line x1="29" y1="17" x2="19" y2="27" stroke="#C8C8C8" strokeWidth="1.5" />
			<line x1="210" y1="18" x2="210" y2="28" stroke="#C8C8C8" strokeWidth="2" />
			<line x1="205" y1="23" x2="215" y2="23" stroke="#C8C8C8" strokeWidth="2" />
			<line x1="206" y1="19" x2="214" y2="27" stroke="#C8C8C8" strokeWidth="1.5" />
			<line x1="214" y1="19" x2="206" y2="27" stroke="#C8C8C8" strokeWidth="1.5" />
			<circle cx="42" cy="36" r="2" fill="#C8C8C8" />
			<circle cx="196" cy="42" r="2" fill="#C8C8C8" />
			<circle cx="14" cy="58" r="1.5" fill="#CACACA" />
			<circle cx="226" cy="60" r="1.5" fill="#CACACA" />
		</svg>
	);
}

export function DiningScene() {
	return (
		<svg {...SVG_PROPS}>
			<rect x="0" y="104" width="240" height="44" fill="#CDCDCD" />
			<rect x="0" y="100" width="240" height="8" rx="0" fill="#C4C4C4" />
			<rect x="42" y="134" width="10" height="14" rx="2" fill="#BEBEBE" />
			<rect x="188" y="134" width="10" height="14" rx="2" fill="#BEBEBE" />
			<circle cx="120" cy="80" r="44" fill="#D4D4D4" />
			<circle cx="120" cy="80" r="36" fill="#DCDCDC" />
			<circle cx="120" cy="80" r="20" fill="#D0D0D0" />
			<rect x="71" y="46" width="6" height="52" rx="3" fill="#BEBEBE" />
			<rect x="68" y="38" width="2.5" height="22" rx="1.25" fill="#BEBEBE" />
			<rect x="72" y="38" width="2.5" height="22" rx="1.25" fill="#BEBEBE" />
			<rect x="76" y="38" width="2.5" height="22" rx="1.25" fill="#BEBEBE" />
			<rect x="163" y="50" width="6" height="52" rx="3" fill="#BEBEBE" />
			<path d="M163 38 Q172 48 169 60 L163 60 Z" fill="#BEBEBE" />
			<rect x="44" y="54" width="5" height="48" rx="2.5" fill="#C8C8C8" />
			<ellipse cx="46.5" cy="47" rx="8" ry="10" fill="#C8C8C8" />
			<ellipse cx="46.5" cy="48" rx="5" ry="7" fill="#D4D4D4" />
			<path d="M196 98 Q188 78 191 56 L201 56 Q204 78 196 98 Z" fill="#CACACA" />
			<rect x="193" y="97" width="6" height="2" fill="#C0C0C0" />
			<line x1="196" y1="99" x2="196" y2="108" stroke="#CACACA" strokeWidth="3" />
			<rect x="189" y="107" width="14" height="3" rx="1.5" fill="#CACACA" />
			<rect x="18" y="80" width="10" height="26" rx="2" fill="#D8D8D8" />
			<ellipse cx="23" cy="80" rx="5" ry="2.5" fill="#D0D0D0" />
			<path d="M23 70 Q20 76 23 80 Q26 76 23 70Z" fill="#C4C4C4" />
			<ellipse cx="23" cy="76" rx="4" ry="5" fill="#CCCCCC" opacity="0.4" />
		</svg>
	);
}

export function LodgingScene() {
	return (
		<svg {...SVG_PROPS}>
			<rect x="0" y="0" width="240" height="148" fill="#D8D8D8" opacity="0.5" />
			<rect x="0" y="134" width="240" height="14" fill="#CACACA" />
			<rect x="20" y="22" width="200" height="114" fill="#D0D0D0" />
			<rect x="14" y="14" width="212" height="12" fill="#C4C4C4" />
			<rect x="24" y="10" width="12" height="8" rx="1" fill="#C4C4C4" />
			<rect x="50" y="10" width="12" height="8" rx="1" fill="#C4C4C4" />
			<rect x="76" y="10" width="12" height="8" rx="1" fill="#C4C4C4" />
			<rect x="102" y="10" width="12" height="8" rx="1" fill="#C4C4C4" />
			<rect x="128" y="10" width="12" height="8" rx="1" fill="#C4C4C4" />
			<rect x="154" y="10" width="12" height="8" rx="1" fill="#C4C4C4" />
			<rect x="180" y="10" width="12" height="8" rx="1" fill="#C4C4C4" />
			<rect x="34" y="30" width="22" height="18" rx="2" fill="#BEBEBE" />
			<rect x="72" y="30" width="22" height="18" rx="2" fill="#BEBEBE" />
			<rect x="110" y="30" width="22" height="18" rx="2" fill="#BEBEBE" />
			<rect x="148" y="30" width="22" height="18" rx="2" fill="#BEBEBE" />
			<rect x="186" y="30" width="22" height="18" rx="2" fill="#BEBEBE" />
			<rect x="34" y="60" width="22" height="18" rx="2" fill="#BEBEBE" />
			<rect x="72" y="60" width="22" height="18" rx="2" fill="#BEBEBE" />
			<rect x="110" y="60" width="22" height="18" rx="2" fill="#BEBEBE" />
			<rect x="148" y="60" width="22" height="18" rx="2" fill="#BEBEBE" />
			<rect x="186" y="60" width="22" height="18" rx="2" fill="#BEBEBE" />
			<rect x="34" y="90" width="22" height="18" rx="2" fill="#BEBEBE" />
			<rect x="72" y="90" width="22" height="18" rx="2" fill="#BEBEBE" />
			<rect x="148" y="90" width="22" height="18" rx="2" fill="#BEBEBE" />
			<rect x="186" y="90" width="22" height="18" rx="2" fill="#BEBEBE" />
			<rect x="101" y="108" width="38" height="28" rx="3" fill="#C4C4C4" />
			<path d="M101 122 Q120 108 139 122" fill="#BABABA" />
			<circle cx="133" cy="122" r="2" fill="#B4B4B4" />
			<path d="M94 110 L146 110 L140 102 L100 102 Z" fill="#BABABA" />
			<line x1="103" y1="102" x2="100" y2="110" stroke="#C4C4C4" strokeWidth="1.5" />
			<line x1="112" y1="102" x2="109" y2="110" stroke="#C4C4C4" strokeWidth="1.5" />
			<line x1="121" y1="102" x2="120" y2="110" stroke="#C4C4C4" strokeWidth="1.5" />
			<line x1="130" y1="102" x2="131" y2="110" stroke="#C4C4C4" strokeWidth="1.5" />
			<line x1="138" y1="102" x2="141" y2="110" stroke="#C4C4C4" strokeWidth="1.5" />
			<line x1="120" y1="0" x2="120" y2="14" stroke="#BEBEBE" strokeWidth="2" />
			<rect x="120" y="2" width="18" height="10" rx="1" fill="#CACACA" />
		</svg>
	);
}

export function HistoricalSiteScene() {
	return (
		<svg {...SVG_PROPS}>
			<rect x="0" y="0" width="240" height="148" fill="#D8D8D8" opacity="0.4" />
			<rect x="0" y="128" width="240" height="20" fill="#CACACA" />
			<rect x="14" y="120" width="212" height="10" rx="1" fill="#CECECE" />
			<rect x="22" y="112" width="196" height="10" rx="1" fill="#D4D4D4" />
			<rect x="22" y="104" width="196" height="10" rx="1" fill="#D8D8D8" />
			<rect x="22" y="30" width="196" height="14" fill="#C8C8C8" />
			<rect x="22" y="44" width="196" height="8" fill="#D0D0D0" />
			<polygon points="22,30 120,4 218,30" fill="#D4D4D4" />
			<polygon points="30,30 120,10 210,30" fill="none" stroke="#C4C4C4" strokeWidth="1.5" />
			{[22, 58, 94, 130, 166, 202].map((x) => (
				<rect key={x} x={x} y="52" width="16" height="52" fill="#CECECE" />
			))}
		</svg>
	);
}

export function TopicPageScene() {
	return (
		<svg {...SVG_PROPS}>
			<rect x="54" y="12" width="148" height="130" rx="6" fill="#C8C8C8" transform="rotate(6 128 77)" />
			<rect x="46" y="10" width="148" height="130" rx="6" fill="#D4D4D4" transform="rotate(2 120 75)" />
			<rect x="42" y="8" width="156" height="132" rx="6" fill="#DCDCDC" />
			<path d="M168 8 L198 8 L198 32 Z" fill="#CECECE" />
			<path d="M168 8 L168 32 L198 32" fill="none" stroke="#C4C4C4" strokeWidth="1" />
			<rect x="58" y="24" width="90" height="10" rx="4" fill="#C8C8C8" />
			<rect x="58" y="46" width="124" height="7" rx="3" fill="#CECECE" />
			<rect x="58" y="58" width="116" height="7" rx="3" fill="#CECECE" />
			<rect x="58" y="70" width="130" height="7" rx="3" fill="#CECECE" />
			<rect x="58" y="82" width="100" height="7" rx="3" fill="#CECECE" />
			<line x1="58" y1="96" x2="182" y2="96" stroke="#C8C8C8" strokeWidth="1" />
			<rect x="58" y="104" width="120" height="7" rx="3" fill="#CECECE" />
			<rect x="58" y="116" width="108" height="7" rx="3" fill="#CECECE" />
			<rect x="58" y="128" width="80" height="7" rx="3" fill="#CECECE" />
		</svg>
	);
}

export function GameScene() {
	return (
		<svg {...SVG_PROPS}>
			<rect x="58" y="20" width="50" height="13" rx="6" fill="#C4C4C4" />
			<rect x="132" y="20" width="50" height="13" rx="6" fill="#C4C4C4" />
			<path
				d="M78 30 L162 30 Q200 30 208 60 Q216 88 200 110 Q188 124 168 122 Q152 120 144 106 L96 106 Q88 120 72 122 Q52 124 40 110 Q24 88 32 60 Q40 30 78 30 Z"
				fill="#D0D0D0"
			/>
			<rect x="70" y="56" width="10" height="26" rx="3" fill="#BEBEBE" />
			<rect x="63" y="63" width="24" height="12" rx="3" fill="#BEBEBE" />
			<circle cx="164" cy="54" r="7" fill="#BEBEBE" />
			<circle cx="176" cy="66" r="7" fill="#BEBEBE" />
			<circle cx="164" cy="78" r="7" fill="#BEBEBE" />
			<circle cx="152" cy="66" r="7" fill="#BEBEBE" />
			<rect x="105" y="62" width="11" height="7" rx="3" fill="#BABABA" />
			<rect x="124" y="62" width="11" height="7" rx="3" fill="#BABABA" />
		</svg>
	);
}

export function TourScene() {
	return (
		<svg {...SVG_PROPS}>
			<rect x="0" y="0" width="240" height="148" fill="#D8D8D8" />
			<rect x="0" y="0" width="50" height="48" fill="#D0D0D0" />
			<rect x="58" y="0" width="52" height="48" fill="#D0D0D0" />
			<rect x="118" y="0" width="52" height="48" fill="#D0D0D0" />
			<rect x="178" y="0" width="62" height="48" fill="#D0D0D0" />
			<rect x="0" y="56" width="50" height="44" fill="#D0D0D0" />
			<rect x="58" y="56" width="52" height="44" fill="#D0D0D0" />
			<rect x="118" y="56" width="52" height="44" fill="#D0D0D0" />
			<rect x="178" y="56" width="62" height="44" fill="#D0D0D0" />
			<rect x="0" y="108" width="50" height="40" fill="#D0D0D0" />
			<rect x="58" y="108" width="52" height="40" fill="#D0D0D0" />
			<rect x="118" y="108" width="52" height="40" fill="#D0D0D0" />
			<rect x="178" y="108" width="62" height="40" fill="#D0D0D0" />
			<rect x="0" y="48" width="240" height="8" fill="#E2E2E2" />
			<rect x="0" y="100" width="240" height="8" fill="#E2E2E2" />
			<rect x="50" y="0" width="8" height="148" fill="#E2E2E2" />
			<rect x="110" y="0" width="8" height="148" fill="#E2E2E2" />
			<rect x="170" y="0" width="8" height="148" fill="#E2E2E2" />
			<path
				d="M25 128 L25 52 L114 52 L114 24 L174 24 L174 104 L209 104"
				fill="none"
				stroke="#B0B0B0"
				strokeWidth="3.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeDasharray="7 5"
			/>
			<circle cx="25" cy="128" r="11" fill="#BABABA" />
			<circle cx="25" cy="128" r="5" fill="#E2E2E2" />
			<circle cx="114" cy="24" r="11" fill="#ABABAB" />
			<circle cx="114" cy="24" r="5" fill="#E2E2E2" />
			<circle cx="209" cy="104" r="11" fill="#BABABA" />
			<circle cx="209" cy="104" r="5" fill="#E2E2E2" />
			<circle cx="25" cy="52" r="5" fill="#C4C4C4" />
			<circle cx="114" cy="52" r="5" fill="#C4C4C4" />
			<circle cx="174" cy="24" r="5" fill="#C4C4C4" />
			<circle cx="174" cy="104" r="5" fill="#C4C4C4" />
		</svg>
	);
}

export function TrailScene() {
	return (
		<svg {...SVG_PROPS}>
			<rect x="0" y="0" width="240" height="72" fill="#DCDCDC" />
			<rect x="0" y="66" width="240" height="82" fill="#D0D0D0" />
			<ellipse cx="70" cy="66" rx="100" ry="20" fill="#D6D6D6" />
			<ellipse cx="190" cy="66" rx="90" ry="16" fill="#D8D8D8" />
			<path d="M 86 148 L 154 148 L 128 76 L 112 76 Z" fill="#DEDEDE" />
			<rect x="10" y="84" width="16" height="40" rx="3" fill="#C4C4C4" />
			<ellipse cx="18" cy="80" rx="26" ry="28" fill="#BEBEBE" />
			<rect x="50" y="76" width="10" height="24" rx="2" fill="#C8C8C8" />
			<ellipse cx="55" cy="72" rx="17" ry="18" fill="#C4C4C4" />
			<rect x="80" y="66" width="6" height="14" rx="1" fill="#CACACA" />
			<ellipse cx="83" cy="63" rx="10" ry="11" fill="#C8C8C8" />
			<rect x="214" y="84" width="16" height="40" rx="3" fill="#C4C4C4" />
			<ellipse cx="222" cy="80" rx="26" ry="28" fill="#BEBEBE" />
			<rect x="180" y="76" width="10" height="24" rx="2" fill="#C8C8C8" />
			<ellipse cx="185" cy="72" rx="17" ry="18" fill="#C4C4C4" />
			<rect x="154" y="66" width="6" height="14" rx="1" fill="#CACACA" />
			<ellipse cx="157" cy="63" rx="10" ry="11" fill="#C8C8C8" />
		</svg>
	);
}

export function CommunityPartnerScene() {
	return (
		<svg {...SVG_PROPS}>
			<path
				d="M120 130 Q60 96 40 72 Q20 48 40 28 Q58 10 80 20 Q100 30 120 52 Q140 30 160 20 Q182 10 200 28 Q220 48 200 72 Q180 96 120 130 Z"
				fill="#D4D4D4"
			/>
			<path
				d="M120 112 Q76 86 60 68 Q44 50 60 36 Q74 24 92 32 Q108 38 120 56 Q132 38 148 32 Q166 24 180 36 Q196 50 180 68 Q164 86 120 112 Z"
				fill="#DCDCDC"
			/>
			<circle cx="96" cy="62" r="8" fill="#CACACA" />
			<path d="M84 92 Q84 72 96 70 Q108 72 108 92 Z" fill="#CACACA" />
			<circle cx="120" cy="58" r="8" fill="#C0C0C0" />
			<path d="M108 88 Q108 68 120 66 Q132 68 132 88 Z" fill="#C0C0C0" />
			<circle cx="144" cy="62" r="8" fill="#CACACA" />
			<path d="M132 92 Q132 72 144 70 Q156 72 156 92 Z" fill="#CACACA" />
			<path d="M24 32 Q20 26 16 30 Q12 34 20 40 Q28 34 28 30 Q24 26 24 32 Z" fill="#C8C8C8" />
			<path d="M218 44 Q214 38 210 42 Q206 46 214 52 Q222 46 222 42 Q218 38 218 44 Z" fill="#C8C8C8" />
			<path d="M38 118 Q35 113 32 116 Q29 119 35 124 Q41 119 41 116 Q38 113 38 118 Z" fill="#CACACA" />
			<path d="M200 120 Q197 115 194 118 Q191 121 197 126 Q203 121 203 118 Q200 115 200 120 Z" fill="#CACACA" />
			<path d="M80 14 Q77 10 74 13 Q71 16 77 20 Q83 16 83 13 Q80 10 80 14 Z" fill="#D0D0D0" />
			<path d="M160 14 Q157 10 154 13 Q151 16 157 20 Q163 16 163 13 Q160 10 160 14 Z" fill="#D0D0D0" />
		</svg>
	);
}

export function EventScene() {
	return (
		<svg {...SVG_PROPS}>
			<rect x="12" y="12" width="216" height="132" rx="8" fill="#D4D4D4" />
			<rect x="12" y="12" width="216" height="30" rx="8" fill="#C4C4C4" />
			<rect x="12" y="30" width="216" height="12" fill="#C4C4C4" />
			<rect x="60" y="4" width="10" height="18" rx="5" fill="#BEBEBE" />
			<rect x="115" y="4" width="10" height="18" rx="5" fill="#BEBEBE" />
			<rect x="170" y="4" width="10" height="18" rx="5" fill="#BEBEBE" />
			<rect x="82" y="19" width="76" height="9" rx="4" fill="#D8D8D8" />
			{[0, 1, 2, 3, 4, 5, 6].map((i) => (
				<rect key={i} x={20 + i * 29} y={48} width={20} height={7} rx={3} fill="#CACACA" />
			))}
			{[0, 1, 2, 3].map((row) =>
				[0, 1, 2, 3, 4, 5, 6].map((col) => (
					<rect
						key={`${row}-${col}`}
						x={20 + col * 29}
						y={63 + row * 20}
						width={20}
						height={14}
						rx={3}
						fill={row === 1 && col === 3 ? '#BABABA' : '#DCDCDC'}
					/>
				)),
			)}
		</svg>
	);
}

export function PublicArtScene() {
	return (
		<svg {...SVG_PROPS}>
			<line x1="80" y1="148" x2="110" y2="30" stroke="#C0C0C0" strokeWidth="5" strokeLinecap="round" />
			<line x1="160" y1="148" x2="130" y2="30" stroke="#C0C0C0" strokeWidth="5" strokeLinecap="round" />
			<line x1="88" y1="148" x2="152" y2="148" stroke="#BEBEBE" strokeWidth="3" strokeLinecap="round" />
			<rect x="62" y="10" width="116" height="96" rx="3" fill="#D8D8D8" />
			<rect x="66" y="14" width="108" height="88" rx="2" fill="#E0E0E0" />
			<ellipse cx="102" cy="52" rx="28" ry="34" fill="#D0D0D0" />
			<ellipse cx="138" cy="40" rx="22" ry="26" fill="#CACACA" />
			<ellipse cx="120" cy="68" rx="18" ry="16" fill="#C8C8C8" />
			<path
				d="M72 30 Q90 22 100 40 Q110 56 88 60"
				fill="none"
				stroke="#BEBEBE"
				strokeWidth="3"
				strokeLinecap="round"
			/>
			<path
				d="M148 20 Q162 38 156 58 Q150 72 164 84"
				fill="none"
				stroke="#C4C4C4"
				strokeWidth="3"
				strokeLinecap="round"
			/>
			<path
				d="M78 80 Q96 72 108 84 Q120 96 140 88"
				fill="none"
				stroke="#C8C8C8"
				strokeWidth="2.5"
				strokeLinecap="round"
			/>
			<ellipse cx="120" cy="136" rx="22" ry="10" fill="#CECECE" transform="rotate(-10 120 136)" />
			<ellipse cx="112" cy="134" rx="14" ry="6" fill="#D4D4D4" transform="rotate(-10 112 134)" />
			<circle cx="104" cy="130" r="4" fill="#C0C0C0" />
			<circle cx="116" cy="128" r="3.5" fill="#BABABA" />
			<circle cx="126" cy="132" r="3.5" fill="#C4C4C4" />
			<circle cx="134" cy="136" r="3" fill="#C8C8C8" />
			<line x1="148" y1="112" x2="170" y2="148" stroke="#C4C4C4" strokeWidth="4" strokeLinecap="round" />
			<ellipse cx="149" cy="110" rx="4" ry="6" fill="#BEBEBE" transform="rotate(-30 149 110)" />
		</svg>
	);
}

export function OrganizationScene() {
	return (
		<svg {...SVG_PROPS}>
			<rect x="0" y="0" width="240" height="148" fill="#D8D8D8" opacity="0.4" />
			<rect x="0" y="132" width="240" height="16" fill="#CACACA" />
			<rect x="18" y="64" width="48" height="68" fill="#D0D0D0" />
			<polygon points="14,64 42,40 70,64" fill="#C4C4C4" />
			<rect x="28" y="78" width="12" height="12" rx="1" fill="#BEBEBE" />
			<rect x="46" y="78" width="12" height="12" rx="1" fill="#BEBEBE" />
			<rect x="34" y="104" width="14" height="28" rx="1" fill="#BABABA" />
			<rect x="96" y="36" width="48" height="96" fill="#D4D4D4" />
			<rect x="96" y="36" width="48" height="12" fill="#C4C4C4" />
			<rect x="104" y="58" width="12" height="14" rx="1" fill="#BEBEBE" />
			<rect x="124" y="58" width="12" height="14" rx="1" fill="#BEBEBE" />
			<rect x="104" y="82" width="12" height="14" rx="1" fill="#BEBEBE" />
			<rect x="124" y="82" width="12" height="14" rx="1" fill="#BEBEBE" />
			<rect x="110" y="106" width="20" height="26" rx="1" fill="#BABABA" />
			<line x1="120" y1="24" x2="120" y2="36" stroke="#BEBEBE" strokeWidth="2" />
			<rect x="120" y="26" width="16" height="9" rx="1" fill="#CACACA" />
			<rect x="172" y="56" width="50" height="76" fill="#D0D0D0" />
			<polygon points="168,56 197,34 226,56" fill="#C4C4C4" />
			<rect x="182" y="70" width="12" height="12" rx="1" fill="#BEBEBE" />
			<rect x="200" y="70" width="12" height="12" rx="1" fill="#BEBEBE" />
			<rect x="188" y="104" width="14" height="28" rx="1" fill="#BABABA" />
			<circle cx="42" cy="20" r="3" fill="#C8C8C8" />
			<circle cx="210" cy="22" r="2.5" fill="#C8C8C8" />
			<path d="M150 22 Q156 16 162 22 Q168 16 174 22" fill="none" stroke="#CCCCCC" strokeWidth="2" strokeLinecap="round" />
		</svg>
	);
}

export function RetailScene() {
	return (
		<svg {...SVG_PROPS}>
			<rect x="0" y="0" width="240" height="148" fill="#D8D8D8" opacity="0.4" />
			<rect x="0" y="130" width="240" height="18" fill="#CACACA" />
			<rect x="10" y="30" width="220" height="102" fill="#D0D0D0" />
			<rect x="4" y="20" width="232" height="14" rx="2" fill="#C0C0C0" />
			<rect x="10" y="34" width="220" height="20" fill="#C8C8C8" />
			<rect x="70" y="39" width="100" height="6" rx="3" fill="#D4D4D4" />
			<rect x="88" y="48" width="64" height="4" rx="2" fill="#D0D0D0" />
			<path d="M10 54 L230 54 L230 46 L10 46 Z" fill="#BEBEBE" />
			<line x1="40" y1="46" x2="36" y2="54" stroke="#D0D0D0" strokeWidth="2" />
			<line x1="70" y1="46" x2="66" y2="54" stroke="#D0D0D0" strokeWidth="2" />
			<line x1="100" y1="46" x2="96" y2="54" stroke="#D0D0D0" strokeWidth="2" />
			<line x1="130" y1="46" x2="126" y2="54" stroke="#D0D0D0" strokeWidth="2" />
			<line x1="160" y1="46" x2="156" y2="54" stroke="#D0D0D0" strokeWidth="2" />
			<line x1="190" y1="46" x2="186" y2="54" stroke="#D0D0D0" strokeWidth="2" />
			<line x1="220" y1="46" x2="216" y2="54" stroke="#D0D0D0" strokeWidth="2" />
			<rect x="18" y="58" width="90" height="58" rx="2" fill="#CACACA" />
			<rect x="132" y="58" width="90" height="58" rx="2" fill="#CACACA" />
			<rect x="22" y="62" width="82" height="50" rx="1" fill="#D4D4D4" />
			<rect x="136" y="62" width="82" height="50" rx="1" fill="#D4D4D4" />
			<path d="M40 96 L36 76 L60 76 L56 96 Z" fill="#C0C0C0" />
			<path
				d="M44 76 Q44 70 48 70 Q52 70 52 76"
				fill="none"
				stroke="#BABABA"
				strokeWidth="2.5"
				strokeLinecap="round"
			/>
			<path d="M62 94 L59 78 L78 78 L75 94 Z" fill="#BEBEBE" />
			<path
				d="M65 78 Q65 73 68.5 73 Q72 73 72 78"
				fill="none"
				stroke="#B4B4B4"
				strokeWidth="2"
				strokeLinecap="round"
			/>
			<rect x="140" y="86" width="74" height="3" rx="1" fill="#BEBEBE" />
			<rect x="140" y="96" width="74" height="3" rx="1" fill="#BEBEBE" />
			<rect x="144" y="74" width="10" height="14" rx="1" fill="#C8C8C8" />
			<rect x="158" y="72" width="10" height="16" rx="1" fill="#C4C4C4" />
			<rect x="172" y="75" width="10" height="13" rx="1" fill="#C8C8C8" />
			<rect x="186" y="73" width="10" height="15" rx="1" fill="#C4C4C4" />
			<rect x="104" y="96" width="32" height="34" rx="2" fill="#C4C4C4" />
			<circle cx="130" cy="113" r="2" fill="#B8B8B8" />
			<line x1="120" y1="96" x2="120" y2="130" stroke="#BEBEBE" strokeWidth="1" />
		</svg>
	);
}

export function ParkScene() {
	return (
		<svg {...SVG_PROPS}>
			<rect x="0" y="0" width="240" height="78" fill="#DCDCDC" />
			<rect x="0" y="72" width="240" height="76" fill="#D2D2D2" />
			<ellipse cx="46" cy="73" rx="94" ry="17" fill="#D8D8D8" />
			<ellipse cx="198" cy="73" rx="84" ry="14" fill="#D6D6D6" />
			<path
				d="M 86 148 Q 104 116 106 96 Q 107 82 117 76 L 131 76 Q 123 84 122 98 Q 124 120 140 148 Z"
				fill="#DEDEDE"
			/>
			<rect x="196" y="86" width="9" height="32" rx="2" fill="#C8C8C8" />
			<ellipse cx="200" cy="78" rx="22" ry="19" fill="#C4C4C4" />
			<rect x="152" y="86" width="5" height="32" rx="1" fill="#C4C4C4" />
			<rect x="181" y="86" width="5" height="32" rx="1" fill="#C4C4C4" />
			<path d="M 146 88 L 192 88 L 169 66 Z" fill="#C8C8C8" />
			<rect x="160" y="102" width="18" height="4" rx="1" fill="#BEBEBE" />
			<rect x="162" y="106" width="3" height="12" rx="1" fill="#BEBEBE" />
			<rect x="173" y="106" width="3" height="12" rx="1" fill="#BEBEBE" />
			<rect x="40" y="78" width="12" height="44" rx="3" fill="#C2C2C2" />
			<ellipse cx="46" cy="64" rx="32" ry="26" fill="#BEBEBE" />
			<ellipse cx="26" cy="74" rx="17" ry="14" fill="#C4C4C4" />
			<ellipse cx="66" cy="72" rx="15" ry="13" fill="#C4C4C4" />
			<rect x="58" y="104" width="40" height="5" rx="2" fill="#BEBEBE" />
			<rect x="58" y="94" width="40" height="4" rx="2" fill="#C4C4C4" />
			<rect x="62" y="109" width="4" height="13" rx="1" fill="#B8B8B8" />
			<rect x="90" y="109" width="4" height="13" rx="1" fill="#B8B8B8" />
			<rect x="62" y="98" width="3" height="8" rx="1" fill="#C0C0C0" />
			<rect x="91" y="98" width="3" height="8" rx="1" fill="#C0C0C0" />
			<rect x="127" y="70" width="3" height="50" rx="1.5" fill="#C8C8C8" />
			<circle cx="128.5" cy="66" r="6" fill="#CECECE" />
			<rect x="122" y="118" width="14" height="4" rx="1" fill="#C0C0C0" />
			<ellipse cx="14" cy="126" rx="16" ry="9" fill="#C8C8C8" />
			<ellipse cx="212" cy="132" rx="20" ry="10" fill="#CACACA" />
		</svg>
	);
}
