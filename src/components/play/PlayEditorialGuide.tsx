import {
  ShieldCheck,
  Trophy,
  Activity,
  Footprints,
  IndianRupee,
  Clock,
  MapPin,
  HelpCircle,
  Sparkles,
  Users,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function PlayEditorialGuide() {
  return (
    <article
      id="play-editorial-guide"
      className="mt-14 space-y-12 border-t border-border/80 pt-10 text-foreground"
    >
      {/* Editorial Section 1: KhelGrid Fair Play Code */}
      <section id="fair-play-code" className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-primary border-primary/30">
            Community Standards
          </Badge>
          <span className="text-xs text-muted-foreground">E-E-A-T Verified Sportsmanship</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          The KhelGrid Fair Play & Player Safety Code
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground max-w-3xl">
          Recreational pickup games thrive on mutual respect, timely arrivals, and inclusive
          sportsmanship. Whether you are stepping onto a synthetic turf in Bengaluru or an indoor
          wooden badminton court in Mumbai, every player on KhelGrid agrees to uphold our five core
          principles:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="rounded-2xl border border-border/70 bg-card/60 p-5 space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Clock className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold">15-Minute Arrival Rule</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Arrive at least 15 minutes before slot time for warm-up, kit adjustments, and team
              allocation. Starting on the dot ensures full 60 or 90 minutes of active playing time
              without eating into the next reservation.
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/60 p-5 space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold">Safe & Non-Hostile Play</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Recreational games are designed for fitness, camaraderie, and skill improvement.
              Aggressive slide tackles on artificial turf, dangerous high-sticks, and verbal dissent
              are strictly forbidden.
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/60 p-5 space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold">Equal Rotation & Participation</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              If a pickup match has rolling substitutions (e.g. 7v7 with 9 players per side), hosts
              must ensure equitable court time for every confirmed participant regardless of match
              scoreline.
            </p>
          </div>
        </div>
      </section>

      {/* Editorial Section 2: Skill Level Matrix */}
      <section id="skill-level-matrix" className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-primary border-primary/30">
            Player Matching Guide
          </Badge>
          <span className="text-xs text-muted-foreground">Skill Tier Framework</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Skill Level Self-Assessment Matrix
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground max-w-3xl">
          Matching players with comparable stamina and technical proficiency prevents one-sided
          games, reduces injury risks, and guarantees competitive fun for everyone on the pitch or
          court.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30">
                Beginner
              </Badge>
              <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                Casual / Fitness
              </span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Learning core sport mechanics, returning from a long hiatus, or playing strictly for
              cardiovascular wellness. Pace is relaxed, friendly mistakes are encouraged, and
              emphasis is on participation.
            </p>
            <div className="border-t border-emerald-500/20 pt-2 text-[11px] text-muted-foreground space-y-1">
              <div>
                <strong>Football:</strong> Basic passing, 20-30 min stamina.
              </div>
              <div>
                <strong>Badminton:</strong> Forehand rallies, underarm serves.
              </div>
              <div>
                <strong>Pickleball:</strong> Learning non-volley kitchen rule.
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <Badge className="bg-primary/15 text-primary border-primary/30">Intermediate</Badge>
              <span className="text-[11px] font-medium text-primary">Weekly Regulars</span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Consistent players with solid positioning, tactical awareness, and match fitness.
              Understands defensive transitions, communication on the pitch, and rules like offsides
              or line-calling.
            </p>
            <div className="border-t border-primary/20 pt-2 text-[11px] text-muted-foreground space-y-1">
              <div>
                <strong>Football:</strong> High tempo, positional discipline, 60m stamina.
              </div>
              <div>
                <strong>Badminton:</strong> Smashes, drops, backcourt clears, footwork.
              </div>
              <div>
                <strong>Pickleball:</strong> Dinking strategies, 3rd-shot drops.
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <Badge className="bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30">
                Advanced
              </Badge>
              <span className="text-[11px] font-medium text-purple-600 dark:text-purple-400">
                Competitive / League
              </span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Trained athletes, university players, or corporate league champions. Demands full
              match intensity, quick decision making, crisp execution under pressure, and superior
              physical conditioning.
            </p>
            <div className="border-t border-purple-500/20 pt-2 text-[11px] text-muted-foreground space-y-1">
              <div>
                <strong>Football:</strong> Rapid counter-attacks, tactical presses.
              </div>
              <div>
                <strong>Badminton:</strong> Deceptive shots, jump smashes, high agility.
              </div>
              <div>
                <strong>Pickleball:</strong> Topspin drives, fast hand-battles at kitchen.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Section 3: Surface & Footwear Standards */}
      <section id="footwear-surface-guidelines" className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-primary border-primary/30">
            Injury Prevention
          </Badge>
          <span className="text-xs text-muted-foreground">Equipment & Footwear Protocol</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Turf and Court Footwear Safety Standards
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground max-w-3xl">
          Wearing the wrong footwear on specialized sports surfaces is the leading cause of ankle
          sprains, ACL twists, and premature court degradation. Always check the venue surface
          before packing your kit:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="rounded-2xl border border-border/70 bg-card/60 p-5 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
              <Footprints className="h-4 w-4 text-primary" />
              <span>Synthetic Turf (Football & Box Cricket)</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Mandatory Footwear:</strong> Turf shoes with small rubber dimples (TF sole) or
              flat indoor sneakers.
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Strictly Prohibited:</strong> Metal cleats (SG) and long plastic molded studs
              (FG). Studs catch aggressively in synthetic grass carpet with rubber infill, causing
              sudden knee torquing and tearing the underlying turf seam.
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/60 p-5 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
              <Activity className="h-4 w-4 text-primary" />
              <span>Indoor Wooden & Synthetic Courts (Badminton / Squash / Basketball)</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Mandatory Footwear:</strong> Non-marking natural gum rubber soles (yellow or
              white soft rubber).
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Strictly Prohibited:</strong> Black-soled running shoes or outdoor street
              sneakers. Black carbon rubber leaves permanent skid marks and street dust creates
              slippery patches that cause severe groin pulls and fall injuries.
            </p>
          </div>
        </div>
      </section>

      {/* Editorial Section 4: Cost Transparency & Ethics */}
      <section id="cost-transparency" className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-primary border-primary/30">
            Transparent Economics
          </Badge>
          <span className="text-xs text-muted-foreground">Community Cost Splitting</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          How Pickup Sports Cost Sharing Works on KhelGrid
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground max-w-3xl">
          KhelGrid is committed to 100% fair and transparent cost sharing. Our platform does not
          allow commercial ticket markups on community pickup matches. Here is how cost splits are
          calculated:
        </p>

        <div className="rounded-2xl border border-border/70 bg-gradient-card p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-background/80 border border-border/50 space-y-1">
              <div className="font-semibold text-foreground">1. Total Venue Rental</div>
              <p className="text-muted-foreground">
                The hourly slot rate charged by the venue (e.g. ₹1,200/hr × 1.5 hrs = ₹1,800).
              </p>
            </div>
            <div className="p-3 rounded-xl bg-background/80 border border-border/50 space-y-1">
              <div className="font-semibold text-foreground">2. Consumables & Equipment</div>
              <p className="text-muted-foreground">
                Match ball inflation, match bibs laundering, or certified Yonex Mavis 350 shuttles
                (₹150–₹200).
              </p>
            </div>
            <div className="p-3 rounded-xl bg-background/80 border border-border/50 space-y-1">
              <div className="font-semibold text-foreground">3. Equal Player Split</div>
              <p className="text-muted-foreground">
                Total facility cost is divided equally among confirmed players (e.g. ₹2,000 / 10
                players = ₹200/player).
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Hosts pay their own equal share. Any surplus collected must be refunded to participants
            or invested directly into new match equipment with consent of the group.
          </p>
        </div>
      </section>

      {/* Editorial Section 5: City Pickup Sports Culture */}
      <section id="city-sports-culture" className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-primary border-primary/30">
            Regional Hubs
          </Badge>
          <span className="text-xs text-muted-foreground">Local Sports Ecosystem</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Urban Pickup Sports Culture Across Indian Metros
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground max-w-3xl">
          From early dawn cricket on Mumbai maidaans to midnight 5-a-side floodlit football under
          Bengaluru canopies, amateur sports culture in India is booming with community-driven
          vitality:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          <div className="rounded-2xl border border-border/70 bg-card/60 p-4 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span>Bengaluru: The Nocturnal Turf Capital</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Known for late-evening 7v7 and 5v5 football leagues, box cricket tournaments, and
              early morning pickleball clubs in Indiranagar, HSR Layout, Sarjapur Road, and
              Whitefield.
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/60 p-4 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span>Mumbai: Rooftop Rinks & Fast 5s</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              High-tempo rooftop turf matches in Andheri, Bandra, and Powai. Coastal tennis games
              and weekend morning beach athletics offer vibrant year-round community engagement.
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/60 p-4 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span>Delhi NCR: Weekend Cricket & Indoor Hubs</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Dawn 20-over leather and tennis-ball matches in Dwarka, Noida, and South Delhi,
              alongside air-conditioned badminton and table tennis arenas across Gurugram.
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/60 p-4 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span>Hyderabad: IT Corridor Badminton</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              A massive hub for post-work indoor badminton leagues in Madhapur, Gachibowli, and
              Kondapur, complemented by state-of-the-art box cricket facilities.
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/60 p-4 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span>Pune: Youth Sports & Multi-Turfs</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Vibrant college and young professional leagues in Hinjewadi, Aundh, and Viman Nagar,
              with growing enthusiasm for pickleball and basketball pickup runs.
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/60 p-4 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span>Chennai & Chandigarh</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Chennai brings coastal football and premier swimming clubs in Adyar, while Chandigarh
              boasts spacious sector stadiums and elite table tennis academies.
            </p>
          </div>
        </div>
      </section>
    </article>
  );
}
