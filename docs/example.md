# DMD 仕様

# はじめに  {#sec:dmd_spec_sec1}
DMD(Data Model Description)は、共通語彙基盤の一部として、データ交換を行う当事
者間、データ作成者同士、及び、データ作成者とデータ利用者との間でデータモデルを共
有することを目的とし設計された、データモデルを記述するためのものである。本書は、
DMD の仕様について記述する。

このパラグラフはコラム機能のデモンストレーションである。
このパラグラフはコラム機能のデモンストレーションである。
このパラグラフはコラム機能のデモンストレーションである。
{.note}

```hello
このパラグラフはコラム機能のデモンストレーションである。
このパラグラフはコラム機能のデモンストレーションである。
このパラグラフはコラム機能のデモンストレーションである。
```



共通語彙基盤は、次の2つの語彙で構成されます。

コア語彙
:   分野を超えて使われる共通性のある用語（【人】【氏名】など）の集合

ドメイン語彙
:   コア語彙の概念を継承して定義した、分野固有の用語の集合


全角空白だけの行

　

全角空白だけの行

# 概要
[@sec:dmd_spec_sec1] では本ドキュメントの目的を述べた。
DMD は、データ構造の定義とデータの各項目に対する入力制限や使用可能な文字コレク
ションを規定することによりデータモデルを定義するものであり、コンピュータがデータ
を処理する際に有用な情報と、人がデータの内容を正しく理解できるようにするための情
報をパッケージ化したものである。DMD は、DMD 自体を説明するものとして、[@tbl:dmd_spec_tbl1]に示すメタデータをもつ。

| DMD のメタデータ | 要素 |
|-----------------|-----|
|URL| DMD を取得することができる場所|
|作成日| 作成された日付|
|最終更新日| 最後に更新された日付|
|説明| DMD の概要説明。詳細な説明はドキュメント内に記述される。|
|作成者| 作成者の名称及び参照先となるURL|
|名称| DMD の名称|
|ライセンス| DMD のライセンス|
|バージョン| DMD のバージョン|
|直前のバージョン| 当該DMD の1 つ以前のバージョンの|
|DMD への参照|最新版 当該DMD の最新のバージョンのDMDへの参照|
|既定の文字コレクション| 文字列を値とするデータ項目に使用可能な文字コレクションの既定値|
:DMD のメタデータ{#tbl:dmd_spec_tbl1}

既定の文字コレクションは、**JIS X 0221 附属書A** に規定される組番号によって記載する。
文字コレクションが２つ以上指定された場合は、その和集合を使用可能な文字のコレクシ
ョンとする。

# DMD の構造
DMD はzip 形式のファイルであり、[@fig:dmd_spec_fig1]に示すように、下記のファイ
ルが含まれる。
* DMD ヘッダー(XML 版及びRDF 版)【必須】
* XML のデータモデルを記述するファイル群
	* XML 用語再定義スキーマ【再定義をする場合は必須】
	* XML データスキーマ【必須】
* RDF のデータモデルを記述するファイル群
	* RDF データモデル記述【必須】
* 項目データ
* ドキュメント
* サンプル
* 項目マッピング【必須】

![DMDの構造](dmd_spec_fig1.png){#fig:dmd_spec_fig1}

DMD ヘッダーXML 版及びRDF 版のファイル名は、それぞれ `header.xml`、`header.ttl` と
する。その他のファイルのファイル名については本仕様では定めない。

## DMD ヘッダー
DMD ヘッダーは、DMD のメタデータ（[@tbl:dmd_spec_tbl2] を参照）、及び、DMD に含まれるファイ
ル（[@tbl:dmd_spec_tbl3] を参照）に関する情報をもつ。

DMD ヘッダーはXML 版とRDF 版が用意され、それらは等価な内容をもつ。XML 版及
びRDF 版の双方がDMD に含まれていなければならない。

### XML 版
DMD ヘッダー XML 版は、http://imi.ipa.go.jp/ns/dmd に公開されるスキーマに従って、記述される。本節の最後にスキーマを示す。

ここで、DMD のメタデータとそれを記述するためのXML 要素の対応は表 2 のようにな
る（表中では、xmlns:dmd="http://imi.ipa.go.jp/ns/dmd" のように名前空間が定義されているものとして記述してある）。

|DMD のメタデータ| 要素|
|---------------|-----|
|URL| dmd:URI|
|作成日| dmd:CreationDate|
|最終更新日| dmd:LastModificationDate|
|説明| dmd:Description|
|作成者| dmd:Publisher|
|名称| dmd:Name|
|ライセンス| dmd:License|
|バージョン| dmd:Version|
|直前のバージョン| dmd:Previous|
|最新版| dmd:Latest|
|既定の文字コレクション| dmd:CharCollection|

:DMD のメタデータを記述するXML 要素 {#tbl:dmd_spec_tbl2}

DMD に含めるファイルは、Component 要素を用いて記述する。本仕様で求めるファイ
ルの種類とType 属性の値の関係を表 3 に示す。

|ファイルの種類| Type 属性の値|
|------------|-----|
|DMD| ヘッダー header|
|XML| データスキーマ schema|
|XML| 用語再定義スキーマ redefine-schema|
|RDF| データモデル記述 data-shape|
|項目データ| item-data|
|ドキュメント| document|
|サンプル| sample|
|項目マッピング| mapping|

:ファイルの種類とType 属性の値 {#tbl:dmd_spec_tbl3}


``` DMD ヘッダの XML Schema
<?xml version="1.0" encoding="UTF-8"?>
<xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema"
targetNamespace="http://imi.ipa.go.jp/ns/dmd"
xmlns:dmd="http://imi.ipa.go.jp/ns/dmd">
  <xsd:import namespace="http://www.w3.org/XML/1998/namespace"
  schemaLocation="IMI-xml-lang.xsd"/>
  <xsd:element name="DMD">
    <xsd:complexType>
      <xsd:sequence>
        <xsd:element ref="dmd:URI" minOccurs="0" maxOccurs="1"/>
        <xsd:element ref="dmd:Name" minOccurs="1" maxOccurs="unbounded"/>
        <xsd:element ref="dmd:CreationDate" minOccurs="1" maxOccurs="1"/>
        <xsd:element ref="dmd:LastModificationDate" minOccurs="1" maxOccurs="1"/>
        <xsd:element ref="dmd:Description" minOccurs="1" maxOccurs="unbounded"/>
        <xsd:element ref="dmd:Publisher" minOccurs="1" maxOccurs="1"/>
        <xsd:element ref="dmd:License" minOccurs="1" maxOccurs="1"/>
        <xsd:element ref="dmd:Version" minOccurs="1" maxOccurs="1"/>
        <xsd:element ref="dmd:Previous" minOccurs="0" maxOccurs="1"/>
        <xsd:element ref="dmd:Latest" minOccurs="0" maxOccurs="1"/>
        <xsd:element ref="dmd:CharCollection" minOccurs="0"
  maxOccurs="unbounded"/>
        <xsd:element ref="dmd:Component" minOccurs="0" maxOccurs="unbounded"/>
      </xsd:sequence>
    </xsd:complexType>
  </xsd:element>
  <xsd:element name="URI" type="xsd:anyURI"/>
  <xsd:element name="Name" type="dmd:StringWithXmlLang"/>
  <xsd:element name="CreationDate" type="xsd:date"/>
  <xsd:element name="LastModificationDate" type="xsd:date"/>
  <xsd:element name="Description" type="dmd:StringWithXmlLang"/>
  <xsd:element name="Version" type="xsd:string"/>
  <xsd:element name="Previous" type="xsd:anyURI"/>
  <xsd:element name="Latest" type="xsd:anyURI"/>
  <xsd:element name="CharCollection" type="xsd:integer"/>
  <xsd:element name="Publisher">
    <xsd:complexType>
      <xsd:sequence>
        <xsd:element ref="dmd:URI" minOccurs="0" maxOccurs="1"/>
        <xsd:element ref="dmd:Name" minOccurs="1" maxOccurs="unbounded"/>
      </xsd:sequence>
    </xsd:complexType>
  </xsd:element>
  <xsd:element name="Component">
    <xsd:complexType>
      <xsd:sequence>
        <xsd:element ref="dmd:Description" minOccurs="1" maxOccurs="unbounded"/>
        <xsd:element ref="dmd:License" minOccurs="0" maxOccurs="1"/>
      </xsd:sequence>
      <xsd:attribute name="file" type="xsd:anyURI"/>
      <xsd:attribute name="media-type" type="xsd:string"/>
      <xsd:attribute name="type">
        <xsd:simpleType>
          <xsd:restriction base="xsd:string">
            <xsd:enumeration value="header"/>
            <xsd:enumeration value="schema"/>
            <xsd:enumeration value="redefine-schema"/>
            <xsd:enumeration value="data-shape"/>
            <xsd:enumeration value="item-data"/>
            <xsd:enumeration value="document"/>
            <xsd:enumeration value="sample"/>
            <xsd:enumeration value="mapping"/>
          </xsd:restriction>
        </xsd:simpleType>
      </xsd:attribute>
    </xsd:complexType>
  </xsd:element>
  <xsd:element name="License">
    <xsd:complexType>
      <xsd:sequence>
        <xsd:element ref="dmd:URI" minOccurs="0" maxOccurs="1"/>
        <xsd:element ref="dmd:Name" minOccurs="1" maxOccurs="1"/>
      </xsd:sequence>
    </xsd:complexType>
  </xsd:element>
  <xsd:complexType name="StringWithXmlLang">
    <xsd:simpleContent>
      6
      <xsd:extension base="xsd:string">
        <xsd:attribute ref="xml:lang"/>
      </xsd:extension>
    </xsd:simpleContent>
  </xsd:complexType>
</xsd:schema>
```

### RDF 版
DMD ヘッダー（RDF 版）は下に示す形式で記述される。また、ヘッダーはTurtle 形式
で記述するものとする。

DMD ヘッダー（RDF 版）では、[@tbl:dmd_spec_tbl4] に示す語彙を用いる。

|DMD ヘッダー（RDF 版）で用いる語彙| 本仕様で用いるプレフィックス|
|---|---|
|http://www.w3.org/2002/07/owl#| owl:|
|http://www.w3.org/1999/02/22-rdf-syntax-ns#| rdf:|
|http://www.w3.org/2000/01/rdf-schema#| rdfs:|
|http://www.w3.org/2001/XMLSchema#| xsd:|
|http://purl.org/dc/terms/ |dcterms:|
|http://www.w3.org/ns/adms#| adms:|
|http://www.w3.org/ns/dcat#| dcat:|
|http://imi.ipa.go.jp/ns/dmd#| dmd:|

:DMD ヘッダーで使用される語彙一覧 {#tbl:dmd_spec_tbl4}


DMD ヘッダーにおいて、DMD は、adms:Asset クラスのインスタンスとして表現され、
プロパティとしてDMD のメタデータとファイルの一覧をもつ。

DMD のメタデータは [@tbl:dmd_spec_tbl5]  に示す述語を用いて記述される。

|DMD のメタデータ| 述語|
|---|---|
|作成日| dcterms:issued|
|最終更新日| dcterms:modified|
|説明| dcterms:description|
|作成者| dcterms:publisher|
|名称| dcterms:title|
|ライセンス| dcterms:license|
|バージョン| owl:versionInfo|
|直前のバージョン| adms:previous|
|最新版| adms:last|
|既定の文字コレクション| dmd:charCollection|

: DMD のメタデータと述語{#tbl:dmd_spec_tbl5}

ファイルの一覧は、dcat:distribution により記述される。スキーマの所在地は、データ
モデルの決定に合わせて指定方法を決定する。

各ファイルは、 adms:AssetDistribution クラスのインスタンスとして表現され、それぞれ、dcterms:type によりファイル形式が指定される。

次のでは、DMD ヘッダー（RDF 版）が header.ttl として作成されている。

```DMD ヘッダー（RDF 版）の例 {#lst:dmd_spec_ex2}
@prefix owl: <http://www.w3.org/2002/07/owl#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix dcterms: <http://purl.org/dc/terms/>.
@prefix adms: <http://www.w3.org/ns/adms#>.
@prefix dcat: <http://www.w3.org/ns/dcat#>.
@prefix dmd: <http://imi.ipa.go.jp/ns/dmd#>.
<http://example.org/imins/00068574/> a adms:Asset ;
dcterms:type dmd:DataModelDescription ; # クラスではなく dcterms:type でDMD であることを表現する
  dcterms:issued "2015-09-01"^^xsd:date ;
  dcterms:modified "2015-10-22"^^xsd:date ;
  dcterms:description "犯罪発生情報を表現するための DMD"@ja ;
  dcterms:publisher <http://example.org/user/0123456789> ;
  dcterms:title "犯罪発生情報 DMD"@ja ;
  dcterms:license <http://creativecommons.org/licenses/by/3.0/> ;
  owl:versionInfo "1.0.0" ;
  adms:previous <http://example.org/imins/00068573/> ;
  adms:last <http://example.org/imins/00068575/> ;
  dcat:distribution <header.ttl> ;
  dcat:distribution <crime.xsd> ;
  dcat:distribution <redefine.xsd> ;
  dcat:distribution <crime-shacl.ttl> ;
  dcat:distribution <item-data.json> ;
  dcat:distribution <document.pdf> ;
  dcat:distribution <document.docx> ;
  dcat:distribution <sample.jsonld> ;
  dcat:distribution <mapping-info.json> ;
  dmd:charCollection "258"^^xsd:integer.

## DMD ヘッダー
<header.ttl> a adms:AssetDistribution ;
  dcterms:type dmd:Header .

## XML のデータモデルを記述するファイル群(XML スキーマ)
<redefine.xsd> a adms:AssetDistribution ;
  dcterms:type dmd:XMLSchema .
<crime.xsd> a adms:AssetDistribution ;
  dcterms:type dmd:XMLRedefineSchema .

## RDF のデータモデルを記述するファイル群
### RDF データシェイプ
<crime-shacl.ttl> a adms:AssetDistribution ;
  dcterms:type dmd:RDFDataShape .

### 項目データ
<item-data.json> a adms:AssetDistribution ;
  dcterms:type dmd:ItemData .

## ドキュメント
<document.pdf> a adms:AssetDistribution ;
  dcterms:type dmd:Documentation .
<document.docx> a adms:AssetDistribution ;
  dcterms:type dmd:Documentation .

## サンプル
<sample.ttl> a adms:AssetDistribution ;
  dcterms:type dmd:Sample .

## 項目マッピング
<mapping-info.json> a adms:AssetDistribution ;
  dcterms:type dmd:Mapping .
```

## XML のデータモデルを記述するファイル群 {#sec:dmd_spec_sec3_2}
XMLのデータに対応するデータモデルは、1つ以上のIMI 語彙の用語を再定義（redefine）
したXML スキーマ（用語再定義スキーマ）及び再定義した用語を使用しデータモデルを定
義したXML スキーマ（データスキーマ）の２つ以上のXML スキーマファイルによって定
義される。

データ入力者に対して、項目毎にそこに許される文字コレクションに係る情報を伝える
ことができるようにすることが求められる

### XML用語再定義スキーマ
使用するプロパティの選択、プロパティの値の制限及び各プロパティの出現回数などを
変更してIMI 語彙のクラス用語を再定義するXML スキーマ。

この例では、場所型の住所プロパティを必須項目に変更している。

```XML 用語再定義スキーマの例 {#lst:dmd_spec_ex2}
<?xml version="1.0" encoding="utf-8"?>
<xsd:schema
targetNamespace="http://imi.ipa.go.jp/ns/core/2"
xmlns:ic="http://imi.ipa.go.jp/ns/core/2"
xmlns:xsd="http://www.w3.org/2001/XMLSchema"
>
  <xsd:redefine schemaLocation="Core231.xsd">
    <xsd:group name="場所型-固有要素グループ">
      <xsd:sequence>
        <xsd:element ref="ic:名称" minOccurs="0" maxOccurs="unbounded"/>
        <xsd:element ref="ic:通称" minOccurs="0" maxOccurs="unbounded"/>
        <xsd:element ref="ic:地理識別子" minOccurs="0" maxOccurs="1"/>
        <xsd:element ref="ic:住所" minOccurs="1" maxOccurs="1"/>
        <xsd:element ref="ic:地理座標" minOccurs="0" maxOccurs="1"/>
      </xsd:sequence>
    </xsd:group>
  </xsd:redefine>
</xsd:schema>
```

### XML データスキーマ
データモデルを定義するためのXML スキーマ。型の拡張（extension）によるプロパテ
ィの追加及び型の制約（restriction）によるプロパティの選択を行う。ルートノードは特定の型を０個以上無制限に含むことができる要素とし、その名称は任意とする。

```XML データスキーマの例 {#lst:dmd_spec_ex3}
<?xml version="1.0" encoding="utf-8"?>
<xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema"
targetNamespace="http://example.org/imins/00068574/"
xmlns:ex2="http://example.org/imins/00068574/"
xmlns:ex="http://imi.ipa.go.jp/ns/司法ドメイン"
xmlns:ic="http://imi.ipa.go.jp/ns/core/2">
  <xsd:import namespace="http://imi.ipa.go.jp/ns/core/2"
  schemaLocation="redefine.xsd"/>
  <xsd:import namespace="http://imi.ipa.go.jp/ns/司法ドメイン"
  schemaLocation="IMI-司法ドメイン用語.xsd"/>
  <xsd:element name="犯罪発生情報リスト">
    <xsd:complexType>
      <xsd:sequence>
        <xsd:element ref="ex2:犯罪発生情報" minOccurs="0" maxOccurs="unbounded"/>
      </xsd:sequence>
    </xsd:complexType>
  </xsd:element>
  <xsd:element name="犯罪発生情報" type="ex2:犯罪発生情報型"/>
  <xsd:complexType name="犯罪発生情報型">
    <xsd:annotation>
      <xsd:documentation xml:lang="ja">
        犯罪発生情報を表現するためのデータ型
      </xsd:documentation>
    </xsd:annotation>
    <xsd:complexContent>
      <xsd:extension base="ic:事物型">
        <xsd:sequence>
          <xsd:element ref="ex2:犯罪" minOccurs="0" maxOccurs="unbounded"/>
          <xsd:element ref="ex2:発生箇所" minOccurs="0" maxOccurs="unbounded"/>
          <xsd:element ref="ex2:発生日時" minOccurs="0" maxOccurs="unbounded"/>
          <xsd:element ref="ex2:被害者" minOccurs="0" maxOccurs="unbounded"/>
        </xsd:sequence>
      </xsd:extension>
    </xsd:complexContent>
  </xsd:complexType>
  <xsd:element name="犯罪" type="ex:犯罪型"/>
  <xsd:element name="発生箇所" type="ic:場所型"/>
  <xsd:element name="発生日時" type="ex:司法日時型"/>
  <xsd:element name="被害者" type="ex:司法人型"/>
</xsd:schema>
```

## RDF のデータモデルを記述するファイル群 {#sec:dmd_spec_sec3_3}
### RDF データモデル記述
使用するプロパティの選択、プロパティの値の制限及び各プロパティの出現回数を指定する制約記述である。

上記の制約は、[Shapes Constraint Language (SHACL)](http://www.w3.org/TR/2016/WD-shacl-20160530/)の規定に基づき記述する。

次に、その記述例を示す。

```RDF データモデルの記述例 {#lst:dmd_spec_ex4}
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix sh: <http://www.w3.org/ns/shacl#>.
@prefix ic: <http://imi.ipa.go.jp/ns/core/rdf#>.
@base <http://example.org/shape/place>.
<#MAIN> a sh:Shape ;
  sh:scopeClass ic:場所型 ;
  sh:constraint [
    sh:nodeKind sh:IRI
  ] ;
  sh:property [
    rdfs:label "名称" ;
    sh:predicate ic:名称 ;
    sh:minCount 1 ;
    sh:maxCount 1 ;
    sh:shape <#名称>
  ] ;
  sh:property [
    rdfs:label "地理座標" ;
    sh:predicate ic:地理座標 ;
    sh:maxCount 1 ;
    sh:shape <#座標>
  ] ;
  sh:property [
    rdfs:label "住所" ;
    sh:predicate ic:住所 ;
    sh:minCount 1 ;
    sh:maxCount 1 ;
    sh:shape <#住所>
  ]
.

<#名称> a sh:Shape ;
  sh:property [
    rdfs:label "表記" ;
    sh:predicate ic:表記 ;
    sh:maxCount 1 ;
    sh:datatype xsd:string
  ] ;
  sh:property [
    rdfs:label "カナ表記" ;
    sh:predicate ic:カナ表記 ;
    sh:maxCount 1 ;
    sh:datatype xsd:string
  ]
.

<#座標> a sh:Shape ;
  sh:property [
    rdfs:label "緯度" ;
    sh:predicate ic:緯度 ;
    sh:minCount 1 ;
    sh:maxCount 1 ;
    sh:datatype xsd:string
  ] ;
  sh:property [
    rdfs:label "経度" ;
    sh:predicate ic:経度 ;
    sh:minCount 1 ;
    sh:maxCount 1 ;
    sh:datatype xsd:string
  ]
.

<#住所> a sh:Shape ;
  sh:property [
    rdfs:label "表記" ;
    sh:predicate ic:表記 ;
    sh:minCount 1 ;
    sh:maxCount 1 ;
    sh:datatype xsd:string
  ]
.
```
## 項目データ {#sec:dmd_spec_sec3_4}
項目データは[@sec:dmd_spec_sec3_2] 及び[@sec:dmd_spec_sec3_3] で示されたデータモデルにおいて値となる項目について、項目
ごとのメタデータを記述したものであり、各項目は名称及び文字コレクションなどの情報
により構成される。

項目データは、JSON 形式のファイルであり、全体は”itemList” メンバーのみをもつオ
ブジェクトとして表現される。”itemList”メンバーは項目の配列とする。各項目はオブジェクトであり、一つの”name” メンバー及び０個以上の”charCollectionList”メンバーをもつ。

“name”メンバーは名称を指定する。


”charCollectionList”メンバーは、項目の値型が xsd:string 及び、その拡張型の場合に、その項目に使用できる文字のコレクションを指定する。”charCollectionList”メンバーは、値型が xsd:string 又は、その拡張型でない項目に指定された場合は無視される。また、”charCollectionList”メンバーは省略可能であり、省略した場合にはDMD ヘッダーに指定された既定の文字コレクションに制限される。”charCollectionList”メンバーの値はJIS X 0221 附属書A に規定される組番号の配列とする。文字コレクションが２つ以上指定された場合は、その和集合を使用可能な文字のコレクションとする。

項目データの例を次に示す。

```項目データの例 {#lst:dmd_spec_ex5}
{
  “itemList” : [
    { "name": "ID" },
    { "name": "名前", "charCollectionList": [256, 258] },
    { "name": "緯度" },
    { "name": "経度" },
    { "name": "所在地", "charCollectionList": [256, 258] }
  ]
}
```

## ドキュメント
DMD には複数のドキュメント含めることができる。また、DMD に含めるドキュメント
は任意の形式で作成することができる。

ドキュメントでは、当該DMD の目的や想定される利用シーンなどに関して簡潔に説明
すること。データモデルがもつ各データ項目について、その概要やデータの書式、値の制
限、使用する文字コレクションなど、データ作成時に留意すべき事項について詳述する。
また、当該DMD に対応する表形式のデータを作成する場合のサンプルなども含める。

## サンプル
当該DMD が定義するデータモデルに従って作成されたデータのサンプル。

## 項目マッピング
項目マッピングは項目データの各項目と当該DMD で定義されたデータモデルとの対応
関係をMetadata Vocabulary for Tabular Data
(http://www.w3.org/TR/tabular-metadata/)の規定にしたがってメタデータとして記述したJSON 形式のファイルである。記述にあたっては、[@sec:dmd_spec_sec3_4] の項目データの各項目の名称を順番に並べた表形式データをDMD で定義されるデータモデルに則ったデータへ対応づけるためのメタデータとする。例えば、[@lst:dmd_spec_ex5] の項目データに対しては、次のような表形式データを対象としたメタデータとして記述する。

```マッピングメタデータの対象表形式データの例 {#lst:dmd_spec_ex6}
ID,名前,緯度,経度,所在地,
```
次に項目マッピングの例を示す。この例は、場所型の一部のプロパティを選択したものを
データモデルとしたDMD の場合である。また、対象表形式データは、現在の場所に
place.csv というファイル名で保存されていると仮定している。

```項目マッピングの例 {#lst:dmd_spec_ex7}
{
    "@context": ["http://www.w3.org/ns/csvw", { "@language": "ja" }],
    "url": "./place.csv",
    "tableSchema": {
        "columns": [
            {
                "name": "place",
                "titles": "ID",
                "aboutUrl": "http://example.org/{place}",
                "propertyUrl": "rdf:type",
                "valueUrl": "http://imi.ipa.go.jp/ns/core/rdf#場所型"
            },
            {
                "name": "name",
                "titles": "名前",
                "aboutUrl": "genid:name{place}",
                "propertyUrl": "http://imi.ipa.go.jp/ns/core/rdf#表記"
            },
            {
                "name": "lat",
                "titles": "緯度",
                "aboutUrl": "genid:geo{place}",
                "propertyUrl": "http://imi.ipa.go.jp/ns/core/rdf#緯度"
            },
            {
                "name": "long",
                "titles": "経度",
                "aboutUrl": "genid:geo{place}",
                "propertyUrl": "http://imi.ipa.go.jp/ns/core/rdf#経度"
            },
            {
                "name": "addr",
                "titles": "所在地",
                "aboutUrl": "genid:addr{place}",
                "propertyUrl": "http://imi.ipa.go.jp/ns/core/rdf#表記"
            },
            {
                "virtual": true,
                "aboutUrl": "http://example.org/{place}",
                "propertyUrl": "http://imi.ipa.go.jp/ns/core/rdf#名称",
                "valueUrl": "genid:name{place}"
            },
            {
                "virtual": true,
                "aboutUrl": "http://example.org/{place}",
                "propertyUrl": "http://imi.ipa.go.jp/ns/core/rdf#地理座標",
                "valueUrl": "genid:geo{place}"
            },
            {
                "virtual": true,
                "aboutUrl": "http://example.org/{place}",
                "propertyUrl": "http://imi.ipa.go.jp/ns/core/rdf#住所",
                "valueUrl": "genid:addr{place}"
            }
        ]
    }
}
```
