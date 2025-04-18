// Code generated by Slice Machine. DO NOT EDIT.

import type * as prismic from "@prismicio/client";

type Simplify<T> = { [KeyType in keyof T]: T[KeyType] };

type BlogpostDocumentDataSlicesSlice =
  | SubtitleSlice
  | RichTextBlockSlice
  | BussinessTextSlice
  | MainTitleSlice
  | BlogImageSlice;

/**
 * Content for BlogPost documents
 */
interface BlogpostDocumentData {
  /**
   * Slice Zone field in *BlogPost*
   *
   * - **Field Type**: Slice Zone
   * - **Placeholder**: *None*
   * - **API ID Path**: blogpost.slices[]
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#slices
   */
  slices: prismic.SliceZone<BlogpostDocumentDataSlicesSlice> /**
   * Meta Title field in *BlogPost*
   *
   * - **Field Type**: Text
   * - **Placeholder**: A title of the page used for social media and search engines
   * - **API ID Path**: blogpost.meta_title
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */;
  meta_title: prismic.KeyTextField;

  /**
   * Meta Description field in *BlogPost*
   *
   * - **Field Type**: Text
   * - **Placeholder**: A brief summary of the page
   * - **API ID Path**: blogpost.meta_description
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  meta_description: prismic.KeyTextField;

  /**
   * Meta Image field in *BlogPost*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: blogpost.meta_image
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#image
   */
  meta_image: prismic.ImageField<never>;
}

/**
 * BlogPost document from Prismic
 *
 * - **API ID**: `blogpost`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/custom-types
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type BlogpostDocument<Lang extends string = string> =
  prismic.PrismicDocumentWithUID<
    Simplify<BlogpostDocumentData>,
    "blogpost",
    Lang
  >;

export type AllDocumentTypes = BlogpostDocument;

/**
 * Primary content in *BlogImage → Default → Primary*
 */
export interface BlogImageSliceDefaultPrimary {
  /**
   * BlogMainImage field in *BlogImage → Default → Primary*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: blog_image.default.primary.blogMainImage
   * - **Documentation**: https://prismic.io/docs/field#image
   */
  blogMainImage: prismic.ImageField<never>;

  /**
   * CreationDate field in *BlogImage → Default → Primary*
   *
   * - **Field Type**: Date
   * - **Placeholder**: CreationDate
   * - **API ID Path**: blog_image.default.primary.creationdate
   * - **Documentation**: https://prismic.io/docs/field#date
   */
  creationdate: prismic.DateField;
}

/**
 * Default variation for BlogImage Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type BlogImageSliceDefault = prismic.SharedSliceVariation<
  "default",
  Simplify<BlogImageSliceDefaultPrimary>,
  never
>;

/**
 * Slice variation for *BlogImage*
 */
type BlogImageSliceVariation = BlogImageSliceDefault;

/**
 * BlogImage Shared Slice
 *
 * - **API ID**: `blog_image`
 * - **Description**: BlogImage
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type BlogImageSlice = prismic.SharedSlice<
  "blog_image",
  BlogImageSliceVariation
>;

/**
 * Item in *BussinessText → Default → Primary → BussinessTextItem*
 */
export interface BussinessTextSliceDefaultPrimaryBussinesstextitemItem {
  /**
   * BussinessTextItem field in *BussinessText → Default → Primary → BussinessTextItem*
   *
   * - **Field Type**: Text
   * - **Placeholder**: BussinessTextItem
   * - **API ID Path**: bussiness_text.default.primary.bussinesstextitem[].bussinesstextitem
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  bussinesstextitem: prismic.KeyTextField;
}

/**
 * Primary content in *BussinessText → Default → Primary*
 */
export interface BussinessTextSliceDefaultPrimary {
  /**
   * BussinessTextItem field in *BussinessText → Default → Primary*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: bussiness_text.default.primary.bussinesstextitem[]
   * - **Documentation**: https://prismic.io/docs/field#group
   */
  bussinesstextitem: prismic.GroupField<
    Simplify<BussinessTextSliceDefaultPrimaryBussinesstextitemItem>
  >;
}

/**
 * Default variation for BussinessText Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type BussinessTextSliceDefault = prismic.SharedSliceVariation<
  "default",
  Simplify<BussinessTextSliceDefaultPrimary>,
  never
>;

/**
 * Slice variation for *BussinessText*
 */
type BussinessTextSliceVariation = BussinessTextSliceDefault;

/**
 * BussinessText Shared Slice
 *
 * - **API ID**: `bussiness_text`
 * - **Description**: BussinessText
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type BussinessTextSlice = prismic.SharedSlice<
  "bussiness_text",
  BussinessTextSliceVariation
>;

/**
 * Primary content in *MainTitle → Default → Primary*
 */
export interface MainTitleSliceDefaultPrimary {
  /**
   * MainTitle field in *MainTitle → Default → Primary*
   *
   * - **Field Type**: Text
   * - **Placeholder**: mainTitle
   * - **API ID Path**: main_title.default.primary.maintitle
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  maintitle: prismic.KeyTextField;
}

/**
 * Default variation for MainTitle Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type MainTitleSliceDefault = prismic.SharedSliceVariation<
  "default",
  Simplify<MainTitleSliceDefaultPrimary>,
  never
>;

/**
 * Slice variation for *MainTitle*
 */
type MainTitleSliceVariation = MainTitleSliceDefault;

/**
 * MainTitle Shared Slice
 *
 * - **API ID**: `main_title`
 * - **Description**: MainTitle
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type MainTitleSlice = prismic.SharedSlice<
  "main_title",
  MainTitleSliceVariation
>;

/**
 * Primary content in *RichTextBlock → Default → Primary*
 */
export interface RichTextBlockSliceDefaultPrimary {
  /**
   * RishTextBlock field in *RichTextBlock → Default → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: RishTextBlock
   * - **API ID Path**: rich_text_block.default.primary.rishtextblock
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  rishtextblock: prismic.RichTextField;
}

/**
 * Default variation for RichTextBlock Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type RichTextBlockSliceDefault = prismic.SharedSliceVariation<
  "default",
  Simplify<RichTextBlockSliceDefaultPrimary>,
  never
>;

/**
 * Slice variation for *RichTextBlock*
 */
type RichTextBlockSliceVariation = RichTextBlockSliceDefault;

/**
 * RichTextBlock Shared Slice
 *
 * - **API ID**: `rich_text_block`
 * - **Description**: RichTextBlock
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type RichTextBlockSlice = prismic.SharedSlice<
  "rich_text_block",
  RichTextBlockSliceVariation
>;

/**
 * Primary content in *Subtitle → Default → Primary*
 */
export interface SubtitleSliceDefaultPrimary {
  /**
   * Subtitle field in *Subtitle → Default → Primary*
   *
   * - **Field Type**: Text
   * - **Placeholder**: Subtitle
   * - **API ID Path**: subtitle.default.primary.subtitle
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  subtitle: prismic.KeyTextField;
}

/**
 * Default variation for Subtitle Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type SubtitleSliceDefault = prismic.SharedSliceVariation<
  "default",
  Simplify<SubtitleSliceDefaultPrimary>,
  never
>;

/**
 * Slice variation for *Subtitle*
 */
type SubtitleSliceVariation = SubtitleSliceDefault;

/**
 * Subtitle Shared Slice
 *
 * - **API ID**: `subtitle`
 * - **Description**: Subtitle
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type SubtitleSlice = prismic.SharedSlice<
  "subtitle",
  SubtitleSliceVariation
>;

declare module "@prismicio/client" {
  interface CreateClient {
    (
      repositoryNameOrEndpoint: string,
      options?: prismic.ClientConfig,
    ): prismic.Client<AllDocumentTypes>;
  }

  interface CreateWriteClient {
    (
      repositoryNameOrEndpoint: string,
      options: prismic.WriteClientConfig,
    ): prismic.WriteClient<AllDocumentTypes>;
  }

  interface CreateMigration {
    (): prismic.Migration<AllDocumentTypes>;
  }

  namespace Content {
    export type {
      BlogpostDocument,
      BlogpostDocumentData,
      BlogpostDocumentDataSlicesSlice,
      AllDocumentTypes,
      BlogImageSlice,
      BlogImageSliceDefaultPrimary,
      BlogImageSliceVariation,
      BlogImageSliceDefault,
      BussinessTextSlice,
      BussinessTextSliceDefaultPrimaryBussinesstextitemItem,
      BussinessTextSliceDefaultPrimary,
      BussinessTextSliceVariation,
      BussinessTextSliceDefault,
      MainTitleSlice,
      MainTitleSliceDefaultPrimary,
      MainTitleSliceVariation,
      MainTitleSliceDefault,
      RichTextBlockSlice,
      RichTextBlockSliceDefaultPrimary,
      RichTextBlockSliceVariation,
      RichTextBlockSliceDefault,
      SubtitleSlice,
      SubtitleSliceDefaultPrimary,
      SubtitleSliceVariation,
      SubtitleSliceDefault,
    };
  }
}
