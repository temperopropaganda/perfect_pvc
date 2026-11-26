import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";

import { Reveal } from "@src/components/atoms/Reveal";
import { SocialIcon } from "@src/components/atoms/SocialIcon";
import { cn } from "@src/lib/utils";

type Dealer = {
  name: string;
  city: string;
  state: string;
  address: string;
  phones: string[];
  email: string;
  instagram?: string;
};

type DealerGroup = { region: string; dealers: Dealer[] };

type DealerDirectoryProps = {
  groups: DealerGroup[];
};

const ALL = "Todas";

const phoneHref = (phone: string) => `tel:+55${phone.replace(/\D/g, "")}`;

export const DealerDirectory = ({ groups }: DealerDirectoryProps) => {
  const [region, setRegion] = useState<string>(ALL);
  const visible = region === ALL ? groups : groups.filter((group) => group.region === region);

  return (
    <section className="bg-background py-(--spacing-section)">
      <div className="site-container flex flex-col gap-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 className="text-title text-[clamp(2rem,3.6vw,3.25rem)]">Lojas parceiras</h2>
          <div role="group" aria-label="Filtrar por região" className="flex flex-wrap gap-2">
            {[ALL, ...groups.map((group) => group.region)].map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={region === option}
                onClick={() => setRegion(option)}
                className={cn(
                  "h-10 rounded-btn border px-4 text-sm transition-colors duration-300",
                  region === option
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-foreground/40",
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {visible.map((group) => (
          <div key={group.region} className="flex flex-col gap-5">
            <h3 className="text-label border-b border-border pb-3 text-muted-foreground">
              {group.region}
            </h3>
            <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {group.dealers.map((dealer, index) => (
                <li key={dealer.name}>
                  <Reveal
                    delay={(index % 3) * 0.06}
                    className="flex h-full flex-col gap-6 rounded-3xl bg-paper p-7"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-label text-blue-700">
                        {dealer.city} · {dealer.state}
                      </span>
                      <span className="font-display text-xl font-medium leading-tight tracking-[-0.02em]">
                        {dealer.name}
                      </span>
                    </div>
                    <ul className="flex flex-col gap-3 text-[15px] text-muted-foreground">
                      <li className="flex gap-3">
                        <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                        <span>{dealer.address}</span>
                      </li>
                      {dealer.phones.map((phone) => (
                        <li key={phone}>
                          <a href={phoneHref(phone)} className="flex gap-3 hover:text-foreground">
                            <Phone aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                            {phone}
                          </a>
                        </li>
                      ))}
                      <li>
                        <a
                          href={`mailto:${dealer.email}`}
                          className="flex gap-3 break-all hover:text-foreground"
                        >
                          <Mail aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                          {dealer.email}
                        </a>
                      </li>
                      {dealer.instagram && (
                        <li>
                          <a
                            href={`https://instagram.com/${dealer.instagram}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex gap-3 hover:text-foreground"
                          >
                            <SocialIcon network="instagram" className="mt-0.5 size-4 shrink-0" />@
                            {dealer.instagram}
                          </a>
                        </li>
                      )}
                    </ul>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};
