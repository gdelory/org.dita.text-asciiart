<?xml version="1.0"?>
<xsl:stylesheet version="2.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:saxon="http://icl.com/saxon"
                xmlns:dita-ot="http://dita-ot.sourceforge.net/ns/201007/dita-ot"
                xmlns:xs="http://www.w3.org/2001/XMLSchema"
                extension-element-prefixes="saxon"
                exclude-result-prefixes="dita-ot xs"
                >

  <xsl:param name="FILENAME"/>
  <xsl:variable name="WORKDIR">
    <xsl:apply-templates select="/processing-instruction('workdir-uri')[1]" mode="get-work-dir"/>
  </xsl:variable>

  <xsl:template match="*[contains(@class, ' topic/table ') or contains(@class,' topic/simpletable ')]" name="create-table-tempfile">
    <xsl:variable name="tblfilename">
      <xsl:value-of select="$FILENAME"/>
      <xsl:text>_tbl</xsl:text>
      <xsl:value-of select="count(preceding::*[contains(@class,' topic/table ') or contains(@class,' topic/simpletable ')])+1"/>
      <xsl:text>.tbl</xsl:text>
    </xsl:variable>
      
    <xsl:message>   Creating <xsl:value-of select="$tblfilename"/> from <xsl:value-of select="@xtrc"/> in <xsl:value-of select="@xtrf"/></xsl:message> 
    <!-- Insert the place holder in the original AST topic, for later re-injection  -->
    <block xml:space="preserve" expanse="page"><xsl:call-template name="debug"/><embed-table uri="{$WORKDIR}{$tblfilename}"/></block>
      
    <xsl:result-document href="{$WORKDIR}{$tblfilename}"
                        method="xml"
                        omit-xml-declaration="yes">
      <state name="table_id" value="{count(preceding::*[contains(@class,' topic/table ') or contains(@class,' topic/simpletable ')])+1}"/>
      <state name="fn_offset" value="{count(preceding::*[contains(@class,' topic/fn ')])}"/>
      <xsl:copy-of select="."/>
    </xsl:result-document>
    <xsl:result-document href="{$WORKDIR}{$tblfilename}X"
                          method="text"
                          omit-xml-declaration="yes">
      <xsl:text>FAILED TO PROCESS TABLE </xsl:text><xsl:value-of select="$tblfilename"/>
      </xsl:result-document>
  </xsl:template>
  
  <xsl:template match="*[contains(@class, ' pr-d/syntaxdiagram ')]">
    <xsl:variable name="synfilename">
      <xsl:value-of select="$FILENAME"/>
      <xsl:text>_syn</xsl:text>
      <xsl:value-of select="count(preceding::*[contains(@class,' pr-d/syntaxdiagram ')])+1"/>
      <xsl:text>.syn</xsl:text>
    </xsl:variable>
    
    <xsl:message>   Creating <xsl:value-of select="$synfilename"/> from <xsl:value-of select="@xtrc"/> in <xsl:value-of select="@xtrf"/></xsl:message> 
    <!-- Insert the place holder in the original AST topic, for later re-injection  -->
    <block xml:space="preserve" expanse="page"><xsl:call-template name="debug"/><embed-syn uri="{$WORKDIR}{$synfilename}"/></block>
    
    <xsl:result-document href="{$WORKDIR}{$synfilename}"
                          method="xml"
                          omit-xml-declaration="yes">
      <xsl:copy-of select="."/>
    </xsl:result-document>
    <xsl:result-document href="{$WORKDIR}{$synfilename}X"
                          method="text"
                          omit-xml-declaration="yes">
      <xsl:text>FAILED TO PROCESS SYNTAX DIAGRAM </xsl:text><xsl:value-of select="$synfilename"/>
    </xsl:result-document>
  </xsl:template>
  
  <!-- Do not print synnote at the end of the document
       because they inherit from topic/fn, and they will
       show up at the bottom of the document if we don't
       override the endnotes template for pr-d/synnote
  -->
  <xsl:template match="*[contains(@class,' pr-d/synnote ')]" mode="endnotes" />
  
</xsl:stylesheet>
