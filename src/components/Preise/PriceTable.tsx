import { checkmark_bold } from "@/static/icons";
import Image from "next/image";

export default function PriceTable() {
	return (
		<div className="px-5 my-16 max-small:my-8">
			<h3 className="max-w-3xl mx-auto mb-20 text-center text-dark_text text-[50px] leading-[60px] max-medium:text-[30px] max-medium:leading-9">
				Features Vergleichen
			</h3>
			<div className="max-megalarge:overflow-x-scroll">
				<table className="w-full">
					<thead>
						<tr className="divide-x divide-dark_green/20">
							<th className="p-5"></th>
							<th className="p-5 min-w-[308px]">
								<p className="text-[25px] text-dark_text mb-2 text-center">
									Heidi
								</p>
								<p className="text-center text-[15px] mb-7 text-dark_text/20">
									Für 1-3 Wohnungen
								</p>
								<a
									href="/kontakt"
									className="text-dark_text flex mb-2 items-center justify-center w-full py-4 border border-dark_green/20 rounded-base text-lg transition hover:border-dark_green/10"
								>
									Beraten lassen
								</a>
								<a
									href="/fragebogen"
									className="text-white bg-dark_green flex items-center justify-center w-full py-4 border border-transparent mb-9 rounded-base text-lg transition hover:opacity-80"
								>
									Jetzt starten
								</a>
							</th>
							<th className="p-5 min-w-[308px]">
								<p className="text-[25px] text-dark_text mb-2 text-center">
									Heidi
									<span className="py-0.5 ml-1.5 px-2 rounded-base bg-green text-dark_text text-lg">
										Plus
									</span>
								</p>
								<p className="text-center text-[15px] mb-7 text-dark_text/20">
									Ab 4 Wohnungen
								</p>
								<a
									href="/kontakt"
									className="text-dark_text flex mb-2 items-center justify-center w-full py-4 border border-dark_green/20 rounded-base text-lg transition hover:border-dark_green/10"
								>
									Angebot sichern
								</a>
								<a
									href="/fragebogen"
									className="text-white bg-green flex items-center justify-center w-full py-4 border border-transparent mb-9 rounded-base text-lg transition hover:opacity-80"
								>
									Kostenvoranschlag erhalten
								</a>
							</th>
							<th className="p-5 min-w-[308px]">
								<p className="text-[25px] text-dark_text mb-2 text-center">
									Heidi
									<span className="py-0.5 ml-1.5 px-2 rounded-base bg-[#D9D9D9] text-dark_text text-lg">
										Großkunde
									</span>
								</p>
								<p className="text-center text-[15px] mb-7 text-dark_text/20">
									+100 Wohnungen
								</p>
								<a
									href="/kontakt"
									className="text-dark_text flex mb-2 items-center justify-center w-full py-4 border border-dark_green/20 rounded-base text-lg transition hover:border-dark_green/10"
								>
									Angebot sichern
								</a>
								<a
									href="/fragebogen"
									className="text-white bg-green flex items-center justify-center w-full py-4 border border-transparent mb-9 rounded-base text-lg transition hover:opacity-80"
								>
									Kostenvoranschlag erhalten
								</a>
							</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td
								className="px-7 border-y border-dark_green/20 py-3.5 bg-[#F4F3F2] text-lg font-bold text-dark_text"
								colSpan={4}
							>
								Kostenfrei Installation
							</td>
						</tr>
						<tr className="divide-x divide-dark_green/20">
							<td className="px-7 py-2.5 text-lg text-dark_text">
								Kostenfrei Installation
							</td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
						</tr>
						<tr className="divide-x divide-dark_green/20">
							<td className="px-7 py-2.5 text-lg text-dark_text">
								Kostenfrei Installation
							</td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
						</tr>
						<tr className="divide-x divide-dark_green/20">
							<td className="px-7 py-2.5 text-lg text-dark_text">
								Kostenfrei Installation
							</td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
						</tr>
						<tr className="divide-x divide-dark_green/20">
							<td className="px-7 py-2.5 text-lg text-dark_text">
								Kostenfrei Installation
							</td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
						</tr>
						<tr className="divide-x divide-dark_green/20">
							<td className="px-7 py-2.5 text-lg text-dark_text">
								Kostenfrei Installation
							</td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
						</tr>
						<tr className="divide-x divide-dark_green/20">
							<td className="px-7 py-2.5 text-lg text-dark_text">
								Kostenfrei Installation
							</td>
							<td className="px-7 py-2.5"></td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
						</tr>
						<tr className="divide-x divide-dark_green/20">
							<td className="px-7 py-2.5 text-lg text-dark_text">
								Kostenfrei Installation
							</td>
							<td className="px-7 py-2.5"></td>
							<td className="px-7 py-2.5"></td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
						</tr>
						<tr>
							<td
								className="px-7 border-y border-dark_green/20 py-3.5 bg-[#F4F3F2] text-lg font-bold text-dark_text"
								colSpan={4}
							>
								Kostenfrei Installation
							</td>
						</tr>
						<tr className="divide-x divide-dark_green/20">
							<td className="px-7 py-2.5 text-lg text-dark_text">
								Kostenfrei Installation
							</td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
						</tr>
						<tr className="divide-x divide-dark_green/20">
							<td className="px-7 py-2.5 text-lg text-dark_text">
								Kostenfrei Installation
							</td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
						</tr>
						<tr className="divide-x divide-dark_green/20">
							<td className="px-7 py-2.5 text-lg text-dark_text">
								Kostenfrei Installation
							</td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
						</tr>
						<tr className="divide-x divide-dark_green/20">
							<td className="px-7 py-2.5 text-lg text-dark_text">
								Kostenfrei Installation
							</td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
						</tr>
						<tr className="divide-x divide-dark_green/20">
							<td className="px-7 py-2.5 text-lg text-dark_text">
								Kostenfrei Installation
							</td>
							<td className="px-7 py-2.5"></td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
						</tr>
						<tr className="divide-x divide-dark_green/20">
							<td className="px-7 py-2.5 text-lg text-dark_text">
								Kostenfrei Installation
							</td>
							<td className="px-7 py-2.5"></td>
							<td className="px-7 py-2.5"></td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
						</tr>
						<tr className="divide-x divide-dark_green/20">
							<td className="px-7 py-2.5 text-lg text-dark_text">
								Kostenfrei Installation
							</td>
							<td className="px-7 py-2.5"></td>
							<td className="px-7 py-2.5"></td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
						</tr>
						<tr>
							<td
								className="px-7 border-y border-dark_green/20 py-3.5 bg-[#F4F3F2] text-lg font-bold text-dark_text"
								colSpan={4}
							>
								Kostenfrei Installation
							</td>
						</tr>
						<tr className="divide-x divide-dark_green/20">
							<td className="px-7 py-2.5 text-lg text-dark_text">
								Kostenfrei Installation
							</td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
						</tr>
						<tr className="divide-x divide-dark_green/20">
							<td className="px-7 py-2.5 text-lg text-dark_text">
								Kostenfrei Installation
							</td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
						</tr>
						<tr className="divide-x divide-dark_green/20">
							<td className="px-7 py-2.5 text-lg text-dark_text">
								Kostenfrei Installation
							</td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
						</tr>
						<tr className="divide-x divide-dark_green/20">
							<td className="px-7 py-2.5 text-lg text-dark_text">
								Kostenfrei Installation
							</td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
						</tr>
						<tr className="divide-x divide-dark_green/20">
							<td className="px-7 py-2.5 text-lg text-dark_text">
								Kostenfrei Installation
							</td>
							<td className="px-7 py-2.5"></td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
						</tr>
						<tr className="divide-x divide-dark_green/20">
							<td className="px-7 py-2.5 text-lg text-dark_text">
								Kostenfrei Installation
							</td>
							<td className="px-7 py-2.5"></td>
							<td className="px-7 py-2.5"></td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
						</tr>
						<tr className="divide-x divide-dark_green/20">
							<td className="px-7 py-2.5 text-lg text-dark_text">
								Kostenfrei Installation
							</td>
							<td className="px-7 py-2.5"></td>
							<td className="px-7 py-2.5"></td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
						</tr>
						<tr>
							<td
								className="px-7 border-y border-dark_green/20 py-3.5 bg-[#F4F3F2] text-lg font-bold text-dark_text"
								colSpan={4}
							>
								Kostenfrei Installation
							</td>
						</tr>
						<tr className="divide-x divide-dark_green/20">
							<td className="px-7 py-2.5 text-lg text-dark_text">
								Kostenfrei Installation
							</td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
						</tr>
						<tr className="divide-x divide-dark_green/20">
							<td className="px-7 py-2.5 text-lg text-dark_text">
								Kostenfrei Installation
							</td>
							<td className="px-7 py-2.5"></td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
						</tr>
						<tr className="divide-x divide-dark_green/20">
							<td className="px-7 py-2.5 text-lg text-dark_text">
								Kostenfrei Installation
							</td>
							<td className="px-7 py-2.5"></td>
							<td className="px-7 py-2.5"></td>
							<td className="px-7 py-2.5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									className="block mx-auto"
									src={checkmark_bold}
									alt="checkmark bold"
								/>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
}
