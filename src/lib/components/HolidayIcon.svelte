<script lang="ts">
	import {
		PartyPopper,
		Flag,
		Users,
		Sparkles,
		Wheat,
		Shield,
		Droplets,
		Flower2,
		HardHat,
		MoonStar,
		Flame,
		Circle,
		Lamp,
		Star,
		Sparkle,
		Award,
		Moon,
		Gift,
		Calendar,
		Building2,
		AlertTriangle
	} from 'lucide-svelte';

	interface Props {
		name: string;
		size?: number;
		class?: string;
		strokeWidth?: number;
	}

	let { name, size = 24, class: className = '', strokeWidth = 1.5 }: Props = $props();

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const iconMap: Record<string, any> = {
		'party-popper': PartyPopper,
		flag: Flag,
		users: Users,
		sparkles: Sparkles,
		wheat: Wheat,
		shield: Shield,
		droplets: Droplets,
		'flower-2': Flower2,
		'hard-hat': HardHat,
		'moon-star': MoonStar,
		flame: Flame,
		circle: Circle,
		lamp: Lamp,
		star: Star,
		sparkle: Sparkle,
		award: Award,
		moon: Moon,
		gift: Gift,
		calendar: Calendar,
		building: Building2,
		warning: AlertTriangle
	};

	const IconComponent = $derived(iconMap[name] || Calendar);
</script>

<IconComponent {size} class={className} {strokeWidth} />
