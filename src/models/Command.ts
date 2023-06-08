import {
  Collection,
  CommandInteraction,
  GuildBasedChannel,
  GuildMember,
  Message,
  Role,
  SlashCommandBuilder,
  User,
} from "discord.js";

export class Command {
  public name: string;
  public description: string;
  public category: CommandCategory;
  public docs?: string;
  public permissions?: string[];
  public aliases?: string[];
  public slashData?: SlashCommandBuilder;
  public slashEnabled: boolean;
  public data?: any;
  public run: (
    message: Message | (NypsiCommandInteraction & CommandInteraction),
    args?: string[]
  ) => void;

  constructor(name: string, description: string, category: CommandCategory) {
    this.name = name.toLowerCase();
    this.description = description.toLowerCase();
    this.category = category;

    switch (category) {
      case "money":
        this.docs = "https://docs.nypsi.xyz/economy/";
        break;
      case "music":
        this.docs = "https://docs.nypsi.xyz/music/";
        break;
      case "moderation":
        this.docs = "https://docs.nypsi.xyz/moderation/";
        break;
    }

    this.slashEnabled = false;

    this.slashData = new SlashCommandBuilder().setName(this.name).setDescription(this.description);

    return this;
  }

  public setPermissions(permissions: string[]) {
    this.permissions = permissions;
    return this;
  }

  public setAliases(aliases: string[]) {
    this.aliases = aliases;
    return this;
  }

  public setRun(
    run: (
      message: Message | (NypsiCommandInteraction & CommandInteraction),
      args?: string[]
    ) => void
  ) {
    this.run = run;
    return this;
  }

  public setDocs(url: string) {
    if (!url.startsWith("https://docs.nypsi.xyz/")) {
      throw new Error(`invalid nypsi docs url given for command: ${this.name}`);
    }

    this.docs = url;
    return this;
  }
}

export type CommandCategory =
  | "none"
  | "animals"
  | "fun"
  | "info"
  | "money"
  | "moderation"
  | "admin"
  | "minecraft"
  | "music"
  | "utility"
  | "nsfw";

export interface NypsiCommandInteraction extends CommandInteraction {
  author?: User;
  mentions?: {
    members?: Collection<string, GuildMember>;
    roles?: Collection<string, Role>;
    channels?: Collection<string, GuildBasedChannel>;
  };
  member: GuildMember;
  interaction?: boolean;
  content?: string;
}

export function createNypsiInteraction(
  interaction: any
): NypsiCommandInteraction & CommandInteraction {
  interaction.author = interaction.user;
  interaction.interaction = true;
  return interaction;
}
